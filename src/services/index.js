export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: {
      email: payload.email
    },
    defaults: {
      ...payload
    }
  });

/*
  Create a new for a given mode
*/

export const create = (model, payload) => model.create(payload)

/*
  Find user by email;
*/
export const findUser = (model, payload) =>
  model.findOne({
    where: {
      email: payload
    },
    logging: false
  });

export const findByPk = (model, id, condition = {}) => model.findByPk(id, condition);

/*
  Get all record of a models
*/
export const findAll = (model, condition = {}) => model.findAll(condition);

/*
  Update an model entity
*/
export const update = (model, id, payload) => model.update({
  ...payload
}, {
  where: {
    id
  }
});

/*
  Delete an record by id 
*/

export const deleteByPk = (model, id) => model.destroy({
  where: {
    id
  }
})

/*
  Count the occurrences of element for a given model 
*/

export const count = (model, condition = {}) => model.count(condition)

/*
find activation by key
*/

export const findByKey = (model, key) => model.findOne({
  where: {
    key: key
  }
})