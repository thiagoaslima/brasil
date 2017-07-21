using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Dapper;
using MySql.Data.MySqlClient;

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
        public IActionResult Index([FromBody] Feedback feedback)
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

                return Ok();
            }
        }
    }
}