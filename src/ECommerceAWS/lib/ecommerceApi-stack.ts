import * as cdk from "aws-cdk-lib";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as cwLogs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

// Interface que define as propriedades da stack
interface ECommerceApiStackProps extends cdk.StackProps {
    productsFetchHandler: lambdaNodeJs.NodejsFunction;
    productsAdminHandler: lambdaNodeJs.NodejsFunction;
}

export class ECommerceApiStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: ECommerceApiStackProps) {
        super(scope, id, props);

        // Definição do recurso de log
        const logGroup = new cwLogs.LogGroup(this, "ECommerceApiLogs");

        // Definição do recurso de API Gateway
        // restApiName: Nome da API
        // description: Descrição da API
        // cloudWatchRole: Permite que a API Gateway crie logs no CloudWatch
        // deployOptions: Opções de deploy
        // accessLogDestination: Destino dos logs
        // accessLogFormat: Formato dos logs
        // jsonWithStandardFields: Formato padrão dos logs
        // httpMethod: Método HTTP da requisição
        // ip: Endereço IP do cliente
        // protocol: Protocolo HTTP
        // requestTime: Tempo de requisição
        // resourcePath: Caminho do recurso
        // responseLength: Tamanho da resposta
        // status: Status da resposta
        // caller: Identificador do usuário
        // user: Nome do usuário
        const api = new apiGateway.RestApi(this, "ECommerceApi", {
            restApiName: "ECommerceApi",
            description: "API de E-Commerce",
            cloudWatchRole: true,
            deployOptions: {
                accessLogDestination: new apiGateway.LogGroupLogDestination(logGroup),
                accessLogFormat: apiGateway.AccessLogFormat.jsonWithStandardFields({
                    httpMethod: true,
                    ip: true,
                    protocol: true,
                    requestTime: true,
                    resourcePath: true,
                    responseLength: true,
                    status: true,
                    caller: true,
                    user: true
                })
            }
        });

        // Definição do recurso de produtos
        const productsFetchIntegration = new apiGateway.LambdaIntegration(props.productsFetchHandler);

        // Definição do recurso de produtos (GET /products)
        const productsResource = api.root.addResource("products");

        // Definição do recurso de produtos (GET /products/{id})
        // Onde o recurso de produtos será integrado com o recurso de produtos (GET /products)
        const productResource = productsResource.addResource("{id}");

        // Definição do método GET do recurso de produtos
        // Onde o método GET do recurso de produtos será integrado com a função lambda

        // GET /products
        productsResource.addMethod("GET", productsFetchIntegration);

        // GET /products/{id}
        productResource.addMethod("GET", productsFetchIntegration);

        // Definição do recurso de administração de produtos
        const productsAdminIntegration = new apiGateway.LambdaIntegration(props.productsAdminHandler);

        // POST /products
        productsResource.addMethod("POST", productsAdminIntegration);

        // PUT /products/{id}
        productResource.addMethod("PUT", productsAdminIntegration);

        // DELETE /products/{id}
        productResource.addMethod("DELETE", productsAdminIntegration);
    }
}