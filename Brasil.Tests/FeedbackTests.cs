using Brasil.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Brasil.Tests
{
    public class Class1
    {
        [Fact]
        public void FeedbackValidoGeraOk()
        {
            var feedback = new Feedback()
            {
                Assunto  = "Bug",
                Email    = "arthur.garcia@ibge.gov.br",
                Mensagem = "Algo muito estranho"
            };

            var controller = new FeedbackController();

            var response = controller.Index(feedback);
        }

        [Fact]
        public void FeedbackInvalidoGeraBadRequest()
        {
            var feedback = new Feedback();

            var controller = new FeedbackController();

            try
            {
                controller.Index(feedback);
            } catch(Exception e)
            {
                
            }
        }
    }
}
