import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

// Função assíncrona chamada handler
// event: Dados da requisição
// APIGatewayProxyEvent: Tipo de dado da requisição
// context: Contexto de execução
// APIGatewayProxyResult: Tipo de dado da resposta
// Quando a APIGateway invoca a minha função, ela passa alguns parâmetros: event, context e callback
export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    // Tracing Distribuído
    // ID da requisição
    const lambdaRequestId = context.awsRequestId;
    const apiRequestId = event.requestContext.requestId;

    console.log(`API Gateway RequestId: ${apiRequestId}`);
    console.log(`Lambda RequestId: ${lambdaRequestId}`);

    // Método HTTP da requisição
    const httpMethod = event.httpMethod;

    if (event.resource === "/products") {
        if (httpMethod === 'GET') {
            console.log("GET /products");

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "GET Products - OK"
                })
            }
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Bad Request"
        })
    }
}