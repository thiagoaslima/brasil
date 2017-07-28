using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Dapper;
using MySql.Data.MySqlClient;
using MimeKit;
using MailKit.Net.Smtp;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace Brasil.Controllers
{
    public class Feedback
    {
        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [StringLength(100)]
        public string Assunto { get; set; }
        [Required]
        [StringLength(500)]
        public string Mensagem { get; set; }
        
    }

    public class FeedbackController : Controller
    {

        private static string CONNECTION = "server=srvbd;user id=cidadesAtend_w;password=Tj9*b7$r;database=cidades_atendimento";

        [HttpPost]
        public async Task<IActionResult> Index([FromBody] Feedback feedback)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            int id = 0;

            using (var conn = new MySqlConnection(CONNECTION))
            {
                conn.Open();

                using (var dbTransaction = conn.BeginTransaction())
                {
                    id = conn.Query<int>(@"
                        SET NAMES UTF8;
                        INSERT INTO
                            feedback(email, assunto, mensagem)
                        VALUES(@email, @assunto, @mensagem);SELECT LAST_INSERT_ID()", new { email = feedback.Email, assunto = feedback.Assunto, mensagem = feedback.Mensagem }, dbTransaction).Single();

                    dbTransaction.Commit();
                }
            }

            /**
             * https://dotnetcoretutorials.com/2017/01/11/sending-receiving-email-net-core/
             * 
             * https://github.com/jstedfast/MailKit
             **/
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("", "geonline@ibge.gov.br"));
            message.To.Add(new MailboxAddress("", "arthur.garcia@ibge.gov.br"));
            message.Subject = feedback.Assunto;

            message.Body = new TextPart("plain")
            {
                Text = feedback.Mensagem
            };

            try
            {
                using (var SMTP = new SmtpClient())
                {
                    /**
                     * For demo-purposes, accept all SSL certificates (in case the server supports STARTTLS)
                     **/
                    // SMTP.ServerCertificateValidationCallback = (s, c, h, e) => true;

                    await SMTP.ConnectAsync("mailrelay.ibge.gov.br", 25, false);

                    /**
                     * XOAUTH2 authentication disabled - Não é usado no IBGE
                     **/
                    SMTP.AuthenticationMechanisms.Remove("XOAUTH2");

                    await SMTP.SendAsync(message);
                    await SMTP.DisconnectAsync(true);
                }
            }
            catch (Exception e)
            {
                return Ok();
            }

            

            if (id > 0)
            {
                using (var conn = new MySqlConnection(CONNECTION))
                {
                    conn.Open();

                    using (var dbTransaction = conn.BeginTransaction())
                    {
                        await conn.ExecuteAsync(@"UPDATE feedback SET flag = 1 WHERE id = @id", new { id = id }, dbTransaction);

                        await dbTransaction.CommitAsync();
                    }
                }
            }

            return Ok();
        }
    }
}