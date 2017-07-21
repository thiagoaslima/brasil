using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Dapper;
using MySql.Data.MySqlClient;
using MimeKit;
using MailKit.Net.Smtp;

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
        [HttpPost]
        public IActionResult Index(Feedback feedback)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            using (var conn = new MySqlConnection("server=srvbd;user id=cidadesAtend_w;password=Tj9*b7$r;database=cidades_atendimento"))
            {
                conn.Open();

                using (var dbTransaction = conn.BeginTransaction())
                {
                    conn.Execute(@"
                        INSERT INTO
                            feedback(email, assunto, mensagem)
                        VALUES(@email, @assunto, @mensagem)", new { email = feedback.Email, assunto = feedback.Assunto, mensagem = feedback.Mensagem  }, dbTransaction);
                }
            }

            /**
             * https://dotnetcoretutorials.com/2017/01/11/sending-receiving-email-net-core/
             * 
             * https://github.com/jstedfast/MailKit
             **/
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Brasil Cidades", "geonline@ibge.gov.br"));
            message.To.Add(new MailboxAddress("Atendimento", "arthur.garcia@ibge.gov.br"));
            message.Subject = feedback.Assunto;

            message.Body = new TextPart("plain")
            {
                Text = feedback.Mensagem
            };

            using (var SMTP = new SmtpClient())
            {
                /**
                 * For demo-purposes, accept all SSL certificates (in case the server supports STARTTLS)
                 **/
                // SMTP.ServerCertificateValidationCallback = (s, c, h, e) => true;

                SMTP.Connect("mailrelay.ibge.gov.br", 25, false);

                /**
                 * XOAUTH2 authentication disabled - Não é usado no IBGE
                 **/
                SMTP.AuthenticationMechanisms.Remove("XOAUTH2");

                SMTP.Send(message);
                SMTP.Disconnect(true);
            }

            return Ok();
        }
    }
}