// Documentação: https://docs.aws.amazon.com/

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { PartitionKey } from "aws-cdk-lib/aws-appsync";

export class ProductsAppStack extends cdk.Stack {
    // Atributo que armazena a função lambda
    readonly productsFetchHandler: lambdaNodeJs.NodejsFunction;
    // Atributo que armazena a função lambda
    readonly productsAdminHandler: lambdaNodeJs.NodejsFunction;
    // Atributo que armazena a tabela DynamoDB
    readonly productsTable: dynamodb.Table;

    // scope: Onde a stack será inserida
    // id: Nome da stack
    // props: Propriedades da stack
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        // Construtor da classe pai
        super(scope, id, props);

        // Definição da tabela DynamoDB
        // tableName: Nome da tabela
        // removalPolicy: Política de remoção - DESTROY: Remove a tabela quando a stack for destruída
        // partitionKey: Chave primária
        // billingMode: Modo de cobrança - PROVISIONED: Cobrança por capacidade provisionada
        // readCapacity: Capacidade de leitura
        // writeCapacity: Capacidade de escrita
        this.productsTable = new dynamodb.Table(this, "ProductsTable", {
            tableName: "Products",
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            partitionKey: {
                name: "id",
                type: dynamodb.AttributeType.STRING
            },
            billingMode: dynamodb.BillingMode.PROVISIONED,
            readCapacity: 1,
            writeCapacity: 1
        });

        // Função lambda que busca os produtos
        // runtime: Versão do Node.js
        // functionName: Nome da função
        // entry: Arquivo que contém a função
        // handler: Função que será executada
        // memorySize: Tamanho da memória
        // timeout: Tempo limite de execução
        // bundling: Configurações de minificação e source map
        // minify: Minifica o código
        // sourceMap: Gera um arquivo de source map
        // environment: Variáveis de ambiente
        // PRODUCTS_TABLE_NAME: Nome da tabela DynamoDB
        this.productsFetchHandler = new lambdaNodeJs.NodejsFunction(this, "ProductsFetchFunction", {
            runtime: lambda.Runtime.NODEJS_16_X,
            functionName: "ProductsFetchFunction",
            entry: "lambda/products/productsFetchFunction.ts",
            handler: "handler",
            memorySize: 128,
            timeout: cdk.Duration.seconds(5),
            bundling: {
                minify: true,
                sourceMap: false
            },
            environment: {
                PRODUCTS_TABLE_NAME: this.productsTable.tableName
            }
        });

        // Permite que a função lambda leia os dados da tabela DynamoDB
        this.productsTable.grantReadData(this.productsFetchHandler);

        this.productsAdminHandler = new lambdaNodeJs.NodejsFunction(this, "ProductsAdminFunction", {
            runtime: lambda.Runtime.NODEJS_16_X,
            functionName: "ProductsAdminFunction",
            entry: "lambda/products/productsAdminFunction.ts",
            handler: "handler",
            memorySize: 128,
            timeout: cdk.Duration.seconds(5),
            bundling: {
                minify: true,
                sourceMap: false
            },
            environment: {
                PRODUCTS_TABLE_NAME: this.productsTable.tableName
            }
        });

        // Permite que a função lambda leia e escreva os dados da tabela DynamoDB
        this.productsTable.grantReadWriteData(this.productsAdminHandler);
    }
}