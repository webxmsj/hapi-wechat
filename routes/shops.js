const Joi = require('joi');
const models = require('../models');
const { paginationDefine } = require('../utils/router-helper');
const GROUP_NAME = 'shops';

module.exports = [
    {
        method: 'GET',
        path: `/${GROUP_NAME}`,
        handler: async (request, reply) => {
            const { rows: results, count: totalCount } = await models.shops.findAll({
                attributes: [
                    'id',
                    'name'
                ],
                limit: request.query.limit,
                offset: (request.qeury.page - 1) * request.query.limit
            });
            // 开启分页的插件,返回的数据结构里,需要带上 result 与 totalCount 两个字段
            reply({
                results,
                totalCount
            });
        },
        config: {
            tags: ['api', GROUP_NAME],
            description: '获取店铺列表',
            validate: {
                query: {
                    ...paginationDefine
                    // limit: Joi.number().integer().min(1).default(10).description('每页的条目数'),
                    // page: Joi.number().integer().min(1).default(1).description('页码数')
                }
            }
        }
    },
    {
        method: 'GET',
        path:  `/${GROUP_NAME}/{shopId}/goods`,
        handler: async (request, reply) => {
            // 增加带有 where 的条件查询
            const { rows: results,count: totalCount } = await models.goods.findAndCountAll({
                // 基于 shop_id 的条件查询
                where: {
                    shop_id: request.params.shopId
                },
                attributes: [
                    'id',
                    'name'
                ],
                limit: request.query.limit,
                offset: (request.query.page - 1) * request.query.limit
            })
            reply();
        },
        config: {
            tags: ['api',GROUP_NAME],
            description: '获取店铺的商品列表'
        }
    }
]