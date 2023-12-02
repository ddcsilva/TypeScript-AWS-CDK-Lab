// Documentação: https://docs.aws.amazon.com/

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class ProductsAppStack extends cdk.Stack {
    // Atributo que armazena a função lambda
    readonly productsFetchHandler: lambdaNodeJs.NodejsFunction;

    // scope: Onde a stack será inserida
    // id: Nome da stack
    // props: Propriedades da stack
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        // Construtor da classe pai
        super(scope, id, props);

        // Função lambda que busca os produtos
        // FunctionName: Nome da função
        // Entry: Arquivo que contém a função
        // Handler: Função que será executada
        // MemorySize: Tamanho da memória
        // Timeout: Tempo limite de execução
        // Bundling: Configurações de minificação e source map
        // minify: Minifica o código
        // sourceMap: Gera um arquivo de source map
        this.productsFetchHandler = new lambdaNodeJs.NodejsFunction(this, "ProductsFetchFunction", {
            functionName: "ProductsFetchFunction",
            entry: "lambda/products/productsFetchFunction.ts",
            handler: "handler",
            memorySize: 128,
            timeout: cdk.Duration.seconds(5),
            bundling: {
                minify: true,
                sourceMap: false
            }
        });
    }
}