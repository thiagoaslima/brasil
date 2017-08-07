using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Dapper;
using MySql.Data.MySqlClient;
using MimeKit;
using MailKit.Net.Smtp;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Text;

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
                            feedback(email, assunto, mensagem, flag)
                        VALUES(@email, @assunto, @mensagem, @flag);SELECT LAST_INSERT_ID()", new { email = feedback.Email, assunto = feedback.Assunto, mensagem = feedback.Mensagem, flag = 1 }, dbTransaction).Single();

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
            message.To.Add(new MailboxAddress("", feedback.Email));
            message.Subject = "Manifestação de usuário no Cidades: " + feedback.Assunto;

            var builder = new BodyBuilder();
            builder.HtmlBody = $@"
                <html>
                    <head>
	                    <title>Cidades</title>
	                    <style>
		                    body {{
			                    font: 14px arial, sans-serif;
		                    }}
		
		                    p {{
			                    margin-left: 0.75em;
		                    }}
		
		                    p.footer {{
			                    margin: 2.75em 0;
			                    color: #777;
		                    }}
	                    </style>
                    </head>
                        <body>
                            Prezado(a),<br /><br />
                                O site cidades.ibge.gov.br recebeu a seguinte manifestação de um usuário<br /><br />

                            <h3>Assunto</h3>
                            <p>{feedback.Assunto}</p>

                            <h3>Email</h3>
                            <p>{feedback.Email}</p>

                            <h3>Mensagem</h3>
                            <p>{feedback.Mensagem}</p>

                            <p class='footer'>Esta é uma mensagem automática. Favor não responder.</p>
                        </body>
                    </html>
            ";

            message.Body = builder.ToMessageBody();

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

                    SMTP.Send(message);
                    SMTP.Disconnect(true);
                }
            }
            catch (Exception e)
            {
                using (var conn = new MySqlConnection(CONNECTION))
                {
                    conn.Open();

                    using (var dbTransaction = conn.BeginTransaction())
                    {
                        conn.Execute(@"UPDATE feedback SET flag = 0 WHERE id = @id", new { id = id }, dbTransaction);

                        dbTransaction.Commit();
                    }
                }
            }

            return Ok();
        }
    }
}