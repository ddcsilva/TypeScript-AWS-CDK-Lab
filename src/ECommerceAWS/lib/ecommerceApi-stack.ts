import * as cdk from "aws-cdk-lib";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as cwLogs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

// Interface que define as propriedades da stack
interface ECommerceApiStackProps extends cdk.StackProps {
    productsFetchHandler: lambdaNodeJs.NodejsFunction;
}

export class ECommerceApiStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: ECommerceApiStackProps) {
        super(scope, id, props);

        // Definição do recurso de API Gateway
        const api = new apiGateway.RestApi(this, "ECommerceApi", {
            restApiName: "ECommerceApi",
            description: "API de E-Commerce"
        });

        // Definição do recurso de produtos
        const productsFetchIntegration = new apiGateway.LambdaIntegration(props.productsFetchHandler);

        // Definição do recurso de produtos (GET /products)
        const productsResource = api.root.addResource("products");

        // Definição do método GET do recurso de produtos
        // Onde o método GET do recurso de produtos será integrado com a função lambda
        productsResource.addMethod("GET", productsFetchIntegration);
    }
}