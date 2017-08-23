using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Dapper;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Brasil.Controllers
{
    public class Questionario
    {
        public Questionario()
        {
            this.respostas = new List<Resposta>();
        }

        public List<Resposta> respostas { get; set; }

    }

    public class Resposta {

        [Required]
        [Range(1, 5)]
        public int questao { get; set; }

        /**
         * C# não permite compartilhar o mesmo nome da classe e propriedade :(
         **/
        [Required]
        [StringLength(255)]
        public string value { get; set; }

        [StringLength(255)]
        public string observacao { get; set; }
    }

    public class QuestionarioController : Controller
    {
        private static string CONNECTION = "server=srvbd;user id=cidadesQuestionario_w;password=Tj9*b7$r;database=cidades_questionario";

        [HttpPost]
        public async Task<IActionResult> Index([FromBody] Questionario questionario)
        {
            if (!ModelState.IsValid || questionario.respostas.Count != 5)
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
                            questionario() VALUES();SELECT LAST_INSERT_ID()", dbTransaction).Single();

                    foreach (var resposta in questionario.respostas)
                    {
                        conn.Execute(@"
                            SET NAMES UTF8;
                            INSERT INTO resposta(id_questionario, num_questao, _resposta, observacao)
                                VALUES (@questionario, @questao, @resposta, @observacao)", new { questionario = id, questao = resposta.questao, resposta = resposta.value, observacao = resposta.observacao }, dbTransaction);
                    }

                    dbTransaction.Commit();
                }
            }

            return Ok();
        }
    }
}
