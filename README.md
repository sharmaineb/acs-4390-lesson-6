# ACS 4390 - GraphQL Mutations

## Mutation Challenges

Using your code from assignment 2, solve the following challenges.

Note! The challenges here will use an "in memory" data source so the data will only exist while the server is running.

Use the second homework assignment to complete the challenges below. You'll be adding new features that existing code.

### Challenge 1 - Serve a list of things

You have a list of things, Pets were used in the examples.

Write a mutation that adds a new thing.

It should return the thing that was just created. You'll need to include all of the fields that make the type.

For example if the Pet type looked like this:

```graphql
type Pet {
  name: String!
  species: String!
}
```

The mutation might look like this:

```graphql
type Mutation {
  addPet(name: String!, species: String!): Pet!
}
```

Now you need a resolver to update the array. For the petList it might look like:

```javascript
const root = {
  // ...
  addPet: ({ name, species }) => {
    const pet = { name, species };
    petList.push(pet);
    return pet;
  }
}
```

Test your work with query. Run your server, open Graphiql in your browser and test your mutation.

```graphql
mutation {
  addPet(name: "Ginger", species: "Cat") {
    name
  }
}
```

Try testing all of your things to see if the new one was added to the list.

### Challenge 2 - Update

We need full CRUD functionality!

So far you have "Create" and "Read". What about "Update"?

To do this you'll need to make a query that supports all of the fields a type has, and supply something to identify the record to update.

Add a new mutation to your schema. It should include all of the fields but they can be null except the id. It should return the type.

```graphql
type Mutation {
  // ...
  updatePet(id: Int!, name: String, species: String): Pet
} 
```

Figure that a null value is a field that will not be updated.

Add a resolver. Your resolver should look at the fields and update the values when the field is NOT undefined!

```javascript
const root = {
  // ...
  updatePet: ({ id, name, species }) => {
    const pet = petList[id];  // is there anything at this id? 
    if (pet === undefined) { // Id not return null
      return null;
    }
    // if name or species was not included use the original
    pet.name = name || pet.name; 
    pet.species = species || pet.species;
    return pet;
  }
}
```

Test your work with a query.

- Update an element in your list
- Try changing only one field
- Try updating an id that is out of range

### Challenge 3 - Delete

Make a mutation to delete an element. It should include an id and return the thing that was deleted.

Write the mutation in your schema.

Write a resolver to support the mutation.

Test your work.

Write a query that deletes an item from your list.

- You should get the deleted item and be able to display its fields
- Try deleting an id that doesn't exist; it should return null

### Challenge 4 - Mutation Queries

Write queries that cover all of the CRUD operations you have implemented. Include these in a readme with your project. You should have a query for:

- Creating a new item
- Reading an item from your list
- Updating an item
- Deleting an item

### Challenge 5 - Code Review

Code review your work with another student. This is an important step in the development process. Code is not pushed to the master branch unless it's been reviewed!

### Stretch Challenges

### Challenge 6 - Other lists

If you've implemented a second list, add CRUD operations for that list.
# acs-4390-lesson-6
