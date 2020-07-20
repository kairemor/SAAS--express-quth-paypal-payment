import Models from "../models"; 
import { create, findAll } from "../services"

const {Group} = Models;

export const getAllGroupService = async (req, res, next) => {
  const groups = await findAll(Group)

  return res.status(200).json({
    status : "success", 
    payload: groups
  })
}

export const getGroupByIdService = async (req, res, next) => {
  const group = await Group.findByPk(req.params.id, {include: Models.User})
  res.status(200).json({
    status: "success",
    payload: group.toJSON()
  })
}

export const createGroupService = async (req, res, next) => {
  const group = await create(Group, req.body)

  res.status(200).json({
    status: "success",
    payload: group.toJSON()
  })
}