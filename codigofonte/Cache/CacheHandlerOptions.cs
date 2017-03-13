// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using Microsoft.Extensions.Options;

namespace Microsoft.Extensions.Caching.Handler
{
    /// <summary>
    /// Configuration options for <see cref="CacheHandler"/>.
    /// </summary>
    public class CacheHandlerOptions : IOptions<CacheHandlerOptions>
    {
        /// <summary>
        /// The configuration used to connect to Redis.
        /// </summary>
        public string Configuration { get; set; }

        /// <summary>
        /// The Redis instance name.
        /// </summary>
        public string InstanceName { get; set; }

        /// <summary>
        /// Gets or sets whether connect/configuration timeouts should be explicitly notified via a TimeoutException
        /// </summary>
        public bool AbortOnConnectFail { get; set; }

        CacheHandlerOptions IOptions<CacheHandlerOptions>.Value
        {
            get { return this; }
        }
    }
}