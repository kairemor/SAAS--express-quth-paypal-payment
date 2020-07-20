export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { email: payload.email },
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

export const findByPk = (model, id) => model.findByPk(id);

/*
  Get all record of a models
*/
export const findAll = (model, condition={}) => model.findAll(condition);

/*
  Update an model entity
*/
export const update = (model, id, payload) => model.update(
  {
    ...payload
  },
  { where: {id} }
)