// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using System.Net;
using System.Linq;
using System.IO.Compression;
using System.IO;

namespace Microsoft.Extensions.Caching.Handler
{
    public class CacheHandler : IDistributedCache, IDisposable
    {
        // KEYS[1] = = key
        // ARGV[1] = absolute-expiration - ticks as long (-1 for none)
        // ARGV[2] = sliding-expiration - ticks as long (-1 for none)
        // ARGV[3] = relative-expiration (long, in seconds, -1 for none) - Min(absolute-expiration - Now, sliding-expiration)
        // ARGV[4] = data - byte[]
        // this order should not change LUA script depends on it
        private const string SetScript = (@"
                redis.call('HMSET', KEYS[1], 'absexp', ARGV[1], 'sldexp', ARGV[2], 'data', ARGV[4])
                if ARGV[3] ~= '-1' then
                  redis.call('EXPIRE', KEYS[1], ARGV[3])
                end
                return 1");
        private const string AbsoluteExpirationKey = "absexp";
        private const string SlidingExpirationKey = "sldexp";
        private const string DataKey = "data";
        private const long NotPresent = -1;

        private volatile ConnectionMultiplexer _connection;
        private IDatabase _cache;

        //private readonly CacheHandlerOptions _options;
        private readonly ConfigurationOptions _options;
        private readonly string _instance;

        private readonly SemaphoreSlim _connectionLock = new SemaphoreSlim(initialCount: 1, maxCount: 1);

        private volatile EndPoint _currentMaster;

        public CacheHandler(IOptions<CacheHandlerOptions> optionsAccessor)
        {
            if (optionsAccessor == null)
            {
                throw new ArgumentNullException(nameof(optionsAccessor));
            }

            _options = new ConfigurationOptions();
            foreach (string conf in optionsAccessor.Value.Configuration.Split(','))
                _options.EndPoints.Add(conf);
            _options.AbortOnConnectFail = optionsAccessor.Value.AbortOnConnectFail;
            _options.AllowAdmin = true;
            // This allows partitioning a single backend cache for use with multiple apps/services.
            _instance = optionsAccessor.Value.InstanceName ?? string.Empty;
        }

        public byte[] Get(string key)
        {
            if (key == null)
            {
                throw new ArgumentNullException(nameof(key));
            }

            return GetAndRefresh(key, getData: true);
        }

        public async Task<byte[]> GetAsync(string key)
        {
            if (key == null)
            {
                throw new ArgumentNullException(nameof(key));
            }

            return await GetAndRefreshAsync(key, getData: true);
        }

        public void Set(string key, byte[] value, DistributedCacheEntryOptions options)
        {
            if (key == null)
            {
                throw new ArgumentNullException(nameof(key));
            }

            if (value == null)
            {
                throw new ArgumentNullException(nameof(value));
            }

            if (options == null)
            {
                throw new ArgumentNullException(nameof(options));
            }

            Connect();

            var creationTime = DateTimeOffset.UtcNow;

            var absoluteExpiration = GetAbsoluteExpiration(creationTime, options);

            var result = _cache.ScriptEvaluate(SetScript, new RedisKey[] { _instance + key },
                new RedisValue[]
                {
                        absoluteExpiration?.Ticks ?? NotPresent,
                        options.SlidingExpiration?.Ticks ?? NotPresent,
                        GetExpirationInSeconds(creationTime, absoluteExpiration, options) ?? NotPresent,
                        Compress(value)
                });
        }

        public async Task SetAsync(string key, byte[] value, DistributedCacheEntryOptions options)
        {
            //byte[] newArray = new byte[value.Length + 6];
            //value.CopyTo(newArray, 0);
            //Encoding.ASCII.GetBytes("BATATA").CopyTo(newArray, value.Length);
            //value = newArray;
            if (key == null)
            {
                throw new ArgumentNullException(nameof(key));
            }

            if (value == null)
            {
                throw new ArgumentNullException(nameof(value));
            }

            if (options == null)
            {
                throw new ArgumentNullException(nameof(options));
            }

            await ConnectAsync();

            var creationTime = DateTimeOffset.UtcNow;

            var absoluteExpiration = GetAbsoluteExpiration(creationTime, options);

            await _cache.ScriptEvaluateAsync(SetScript, new RedisKey[] { _instance + key },
                new RedisValue[]
                {
                        absoluteExpiration?.Ticks ?? NotPresent,
                        options.SlidingExpiration?.Ticks ?? NotPresent,
                        GetExpirationInSeconds(creationTime, absoluteExpiration, options) ?? NotPresent,
                        Compress(value)
                    });
        }

        public void Refresh(string key)
        {
            if (key == null)
            {
                throw new ArgumentNullException(nameof(key));
            }

            GetAndRefresh(key, getData: false);
        }

        public async Task RefreshAsync(string key)
        {
            if (key == null)
            {
                throw new ArgumentNullException(nameof(key));
            }

            await GetAndRefreshAsync(key, getData: false);
        }

        private void Connect()
        {
            if (_connection != null)
            {
                return;
            }

            _connectionLock.Wait();
            try
            {
                if (_connection == null)
                {
                    _connection = ConnectionMultiplexer.Connect(_options);
                    //AddConnectionEvents();
                    _cache = _connection.GetDatabase();
                }
            }
            finally
            {
                _connectionLock.Release();
            }
        }

        private async Task ConnectAsync()
        {
            if (_connection != null)
            {
                return;
            }

            _connectionLock.Wait();
            try
            {
                if (_connection == null)
                {
                    _connection = await ConnectionMultiplexer.ConnectAsync(_options);
                    //AddConnectionEvents();
                    _cache = _connection.GetDatabase();
                }
            }
            finally
            {
                _connectionLock.Release();
            }
        }

        private byte[] GetAndRefresh(string key, bool getData)
        {
            if (key == null)
            {
                throw new ArgumentNullException(nameof(key));
            }

            Connect();

            // This also resets the LRU status as desired.
            // TODO: Can this be done in one operation on the server side? Probably, the trick would just be the DateTimeOffset math.
            RedisValue[] results;
            if (getData)
            {
                results = _cache.HashMemberGet(_instance + key, AbsoluteExpirationKey, SlidingExpirationKey, DataKey);
            }
            else
            {
                results = _cache.HashMemberGet(_instance + key, AbsoluteExpirationKey, SlidingExpirationKey);
            }

            // TODO: Error handling
            if (results.Length >= 2)
            {
                // Note we always get back two results, even if they are all null.
                // These operations will no-op in the null scenario.
                DateTimeOffset? absExpr;
                TimeSpan? sldExpr;
                MapMetadata(results, out absExpr, out sldExpr);
                Refresh(key, absExpr, sldExpr);
            }

            if (results.Length >= 3 && results[2].HasValue)
            {
                return Decompress(results[2]);
            }

            return null;
        }

        private async Task<byte[]> GetAndRefreshAsync(string key, bool getData)
        {
            if (key == null)
            {
                throw new ArgumentNullException(nameof(key));
            }

            await ConnectAsync();

            // This also resets the LRU status as desired.
            // TODO: Can this be done in one operation on the server side? Probably, the trick would just be the DateTimeOffset math.
            RedisValue[] results;
            if (getData)
            {
                results = await _cache.HashMemberGetAsync(_instance + key, AbsoluteExpirationKey, SlidingExpirationKey, DataKey);
            }
            else
            {
                results = await _cache.HashMemberGetAsync(_instance + key, AbsoluteExpirationKey, SlidingExpirationKey);
            }

            // TODO: Error handling
            if (results.Length >= 2)
            {
                // Note we always get back two results, even if they are all null.
                // These operations will no-op in the null scenario.
                DateTimeOffset? absExpr;
                TimeSpan? sldExpr;
                MapMetadata(results, out absExpr, out sldExpr);
                await RefreshAsync(key, absExpr, sldExpr);
            }

            if (results.Length >= 3 && results[2].HasValue)
            {
                return Decompress(results[2]);
            }

            return null;
        }

        public void Remove(string key)
        {
            if (key == null)
            {
                throw new ArgumentNullException(nameof(key));
            }

            Connect();

            _cache.KeyDelete(_instance + key);
            // TODO: Error handling
        }

        public async Task RemoveAsync(string key)
        {
            if (key == null)
            {
                throw new ArgumentNullException(nameof(key));
            }

            await ConnectAsync();

            await _cache.KeyDeleteAsync(_instance + key);
            // TODO: Error handling
        }

        private void MapMetadata(RedisValue[] results, out DateTimeOffset? absoluteExpiration, out TimeSpan? slidingExpiration)
        {
            absoluteExpiration = null;
            slidingExpiration = null;
            var absoluteExpirationTicks = (long?)results[0];
            if (absoluteExpirationTicks.HasValue && absoluteExpirationTicks.Value != NotPresent)
            {
                absoluteExpiration = new DateTimeOffset(absoluteExpirationTicks.Value, TimeSpan.Zero);
            }
            var slidingExpirationTicks = (long?)results[1];
            if (slidingExpirationTicks.HasValue && slidingExpirationTicks.Value != NotPresent)
            {
                slidingExpiration = new TimeSpan(slidingExpirationTicks.Value);
            }
        }

        private void Refresh(string key, DateTimeOffset? absExpr, TimeSpan? sldExpr)
        {
            if (key == null)
            {
                throw new ArgumentNullException(nameof(key));
            }

            // Note Refresh has no effect if there is just an absolute expiration (or neither).
            TimeSpan? expr = null;
            if (sldExpr.HasValue)
            {
                if (absExpr.HasValue)
                {
                    var relExpr = absExpr.Value - DateTimeOffset.Now;
                    expr = relExpr <= sldExpr.Value ? relExpr : sldExpr;
                }
                else
                {
                    expr = sldExpr;
                }
                _cache.KeyExpire(_instance + key, expr);
                // TODO: Error handling
            }
        }

        private async Task RefreshAsync(string key, DateTimeOffset? absExpr, TimeSpan? sldExpr)
        {
            if (key == null)
            {
                throw new ArgumentNullException(nameof(key));
            }

            // Note Refresh has no effect if there is just an absolute expiration (or neither).
            TimeSpan? expr = null;
            if (sldExpr.HasValue)
            {
                if (absExpr.HasValue)
                {
                    var relExpr = absExpr.Value - DateTimeOffset.Now;
                    expr = relExpr <= sldExpr.Value ? relExpr : sldExpr;
                }
                else
                {
                    expr = sldExpr;
                }
                await _cache.KeyExpireAsync(_instance + key, expr);
                // TODO: Error handling
            }
        }

        private static long? GetExpirationInSeconds(DateTimeOffset creationTime, DateTimeOffset? absoluteExpiration, DistributedCacheEntryOptions options)
        {
            if (absoluteExpiration.HasValue && options.SlidingExpiration.HasValue)
            {
                return (long)Math.Min(
                    (absoluteExpiration.Value - creationTime).TotalSeconds,
                    options.SlidingExpiration.Value.TotalSeconds);
            }
            else if (absoluteExpiration.HasValue)
            {
                return (long)(absoluteExpiration.Value - creationTime).TotalSeconds;
            }
            else if (options.SlidingExpiration.HasValue)
            {
                return (long)options.SlidingExpiration.Value.TotalSeconds;
            }
            return null;
        }

        private static DateTimeOffset? GetAbsoluteExpiration(DateTimeOffset creationTime, DistributedCacheEntryOptions options)
        {
            if (options.AbsoluteExpiration.HasValue && options.AbsoluteExpiration <= creationTime)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(DistributedCacheEntryOptions.AbsoluteExpiration),
                    options.AbsoluteExpiration.Value,
                    "The absolute expiration value must be in the future.");
            }
            var absoluteExpiration = options.AbsoluteExpiration;
            if (options.AbsoluteExpirationRelativeToNow.HasValue)
            {
                absoluteExpiration = creationTime + options.AbsoluteExpirationRelativeToNow;
            }

            return absoluteExpiration;
        }

        public void Dispose()
        {
            if (_connection != null)
            {
                _connection.Close();
            }
        }

        /// <summary>
        /// Configura os eventos de quando um server cai e � resumido, elegendo um novo master quando necess�rio.
        /// </summary>
        private void AddConnectionEvents()
        {

            _connection.ConnectionRestored += (src, args) =>
            {
                if (_connection != null)
                {
                    return;
                }

                _connectionLock.Wait();
                try
                {
                    if (_connection == null)
                    {
                        //Get the current master
                        _currentMaster = _connection.GetEndPoints().Where(e => !_connection.GetServer(e).IsSlave).FirstOrDefault();
                        // Reborn servers must hail the current master
                        _connection.GetServer(args.EndPoint)?.SlaveOf(_currentMaster);
                    }
                }
                finally
                {
                    _connectionLock.Release();
                }
            };

            _connection.ConnectionFailed += (src, args) =>
            {
                if (_connection != null)
                {
                    return;
                }

                _connectionLock.Wait();
                try
                {
                    if (_connection == null)
                    {
                        var server = _connection.GetServer(args.EndPoint);
                        if (!server.IsSlave) // The master has fallen!
                        {
                            // Get a lucky worthy slave
                            _currentMaster = _connection.GetEndPoints().Where(e => _connection.GetServer(e).IsConnected && _connection.GetServer(e).IsSlave).FirstOrDefault();
                            if (_currentMaster != null)
                            {
                                // Promotes the chosen slave to a new master of all
                                _connection.GetServer(_currentMaster).SlaveOf(null);
                                // Make them kneel and bow to the new master
                                _connection.GetEndPoints().Where(e => e != _currentMaster && _connection.GetServer(e).IsConnected).ToList().ForEach(e => _connection.GetServer(e).SlaveOf(_currentMaster));
                            }
                        }
                    }
                }
                finally
                {
                    _connectionLock.Release();
                }
            };
        }

        /// <summary>
        /// Compress an array of bytes.
        /// </summary>
        /// <param name="value">The raw byte[] to be compressd.</param>
        /// <returns>Compressed array of bytes.</returns>
        private byte[] Compress(byte[] value)
        {
            using (MemoryStream memory = new MemoryStream())
            {
                using (GZipStream gzip = new GZipStream(memory,
                CompressionLevel.Optimal, true))
                {
                    gzip.Write(value, 0, value.Length);
                }
                return memory.ToArray();
            }
        }

        /// <summary>
        /// Decompress an array of bytes.
        /// </summary>
        /// <param name="value">The compressed byte[] to be decompressed.</param>
        /// <returns>Decompressed array of bytes.</returns>
        private byte[] Decompress(byte[] value)
        {
            MemoryStream stream = new MemoryStream();
            GZipStream unzippedStream = new GZipStream(new MemoryStream(value), CompressionMode.Decompress);
            unzippedStream.CopyTo(stream);
            return stream.ToArray();
        }

    }
}