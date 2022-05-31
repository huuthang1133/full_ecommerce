const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Product {
    id: ID
    title: String
    price: Int
    description: String
    category: Category
    sold: Int
    quantity: Int
    images: Image
  }
  type Image {
    public_id: String
    url: String
  }

  type Payment {
    id: ID
    user: User
    cart: [ItemInCart]
    createAt: String
  }

  type ItemInCart {
    product: Product
    qty: Int!
  }

  # type Cart {
  # cart: [ItemInCart]
  #}

  type Category {
    id: ID!
    name: String
    products: [Product]
  }

  type User {
    id: ID!
    name: String
    email: String!
  }

  type Auth {
    refreshToken: String!
  }

  type AccessToken {
    accessToken: String!
    user: User
  }

  scalar Upload

  type File {
    public_id: String
    url: String
  }

  input CartInput {
    productId: ID!
    qty: Int!
  }

  # ROOT TYPE
  type Query {
    images: Image
    products(page: Int, title: String, sort: String): [Product]
    product(id: ID!): Product
    categories: [Category]
    category(id: ID!): Category
    users: [User]
    user: User
    payment: [Payment]
    paymentByUserId: [Payment]
  }

  type Mutation {
    createProduct(
      title: String!
      price: Int!
      description: String!
      categoryId: ID!
      sold: Int
      quantity: Int
    ): Product
    updateProduct(
      id: ID!
      title: String
      price: Int
      description: String
      categoryId: String
      sold: Int
    ): Product
    deleteProduct(id: ID!): Product
    createCategory(name: String!): Category
    register(name: String, email: String, password: String): User
    login(email: String, password: String): Auth
    refreshToken(refreshToken: String): AccessToken
    singleUpload(file: Upload!): File!
    payment(cart: [CartInput]): Payment
  }
`;

module.exports = typeDefs;
