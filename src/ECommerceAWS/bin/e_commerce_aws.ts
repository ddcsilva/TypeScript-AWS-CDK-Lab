#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ECommerceApiStack } from '../lib/ecommerceApi-stack';

const app = new cdk.App();

// Definição do Ambiente
const environment: cdk.Environment = {
  account: "458218035895",
  region: "us-east-1"
}

// Definição dos Tags
const tags = {
  cost: "Ecommerce",
  team: "Danilo"
}

// Definição da Stack de Produtos
const productsAppStack = new ProductsAppStack(app, 'ProductsApp', {
  env: environment,
  tags: tags
});

// Definição da Stack da API
const ecommerceApiStack = new ECommerceApiStack(app, 'ECommerceApi', {
  env: environment,
  tags: tags,
  productsFetchHandler: productsAppStack.productsFetchHandler
});

// Definição da dependência entre as stacks
ecommerceApiStack.addDependency(productsAppStack);