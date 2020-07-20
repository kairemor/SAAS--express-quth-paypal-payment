import * as groupService from '../services/groupService' 

export const getAllGroupController = async(req, res, next) => {
  await groupService.getAllGroupService(req, res, next)
}

export const getGroupByIdController = async(req, res, next) => {
  await groupService.getGroupByIdService(req, res, next)
}

export const createGroupController = async(req, res, next) => {
  await groupService.createGroupService(req, res, next) 
}