(ns metabase.api.graphql
  "/api/graphql endpoints."
  (:require [compojure.core :refer [POST]]
            [korma.core :as k]
            [metabase.api.common :refer :all]
            [metabase.db :refer :all]
            (metabase.models common
                             [hydrate :refer [hydrate]]
                             [database :refer [Database]]
                             [field :refer [Field]]
                             [table :refer [Table]])
            [cheshire.core :as json]))

(import 'graphql.schema.GraphQLObjectType)
(import 'graphql.schema.GraphQLSchema)

(import 'graphql.Scalars)
(import 'graphql.schema.GraphQLFieldDefinition)
(import 'graphql.schema.GraphQLObjectType)
(import 'graphql.schema.GraphQLList)
(import 'graphql.schema.GraphQLTypeReference)
(import 'graphql.schema.DataFetcher)

(def fieldType
  (-> (GraphQLObjectType/newObject)
    (.name "Field")
    (.field (-> (GraphQLFieldDefinition/newFieldDefinition)
              (.name "id")
              (.type Scalars/GraphQLString)
              (.build)))
    (.field (-> (GraphQLFieldDefinition/newFieldDefinition)
              (.name "name")
              (.type Scalars/GraphQLString)
              (.build)))
    (.field (-> (GraphQLFieldDefinition/newFieldDefinition)
              (.name "display_name")
              (.type Scalars/GraphQLString)
              (.build)))
    (.field (-> (GraphQLFieldDefinition/newFieldDefinition)
              (.name "description")
              (.type Scalars/GraphQLString)
              (.build)))
    (.build)))

(def tableType
  (-> (GraphQLObjectType/newObject)
    (.name "Table")
    (.field (-> (GraphQLFieldDefinition/newFieldDefinition)
              (.name "id")
              (.type Scalars/GraphQLString)
              (.build)))
    (.field (-> (GraphQLFieldDefinition/newFieldDefinition)
              (.name "name")
              (.type Scalars/GraphQLString)
              (.build)))
    (.field (-> (GraphQLFieldDefinition/newFieldDefinition)
              (.name "display_name")
              (.type Scalars/GraphQLString)
              (.build)))
    (.field (-> (GraphQLFieldDefinition/newFieldDefinition)
              (.name "description")
              (.type Scalars/GraphQLString)
              (.build)))
    (.field (-> (GraphQLFieldDefinition/newFieldDefinition)
              (.name "fields")
              (.type (new GraphQLList fieldType))
              (.build)))
    (.build)))

(def databaseType
  (-> (GraphQLObjectType/newObject)
    (.name "Database")
    (.field (-> (GraphQLFieldDefinition/newFieldDefinition)
              (.name "id")
              (.type Scalars/GraphQLString)
              (.build)))
    (.field (-> (GraphQLFieldDefinition/newFieldDefinition)
              (.name "name")
              (.type Scalars/GraphQLString)
              (.build)))
    (.field (-> (GraphQLFieldDefinition/newFieldDefinition)
              (.name "tables")
              (.type (new GraphQLList tableType))
              (.build)))
    (.build)))

(def queryType
  (-> (GraphQLObjectType/newObject)
    (.name "QueryType")
    (.field (-> (GraphQLFieldDefinition/newFieldDefinition)
              (.name "databases")
              (.type (new GraphQLList databaseType))
              (.dataFetcher (reify DataFetcher
                (get [this environment]
                  (clojure.walk/stringify-keys
                    (-> (sel :many Database (k/order :name))
                        (hydrate [:tables :fields]))))))
              (.build)))
    (.build)))

(def schema
  (-> (GraphQLSchema/newSchema)
    (.query queryType)
    (.build)))

(defendpoint POST "/"
  "GraphQL endpoint"
  [:as {{:keys [query] :as body} :body}]
  (let [executionResult (-> (new graphql.GraphQL schema) (.execute query))]
    (if (> (count (.getErrors executionResult)) 0)
      {:data   (.getData executionResult)
       :errors (.getErrors executionResult)}
      {:data (.getData executionResult)})))

(define-routes)
