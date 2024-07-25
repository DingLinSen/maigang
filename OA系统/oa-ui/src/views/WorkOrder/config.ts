import { isAuth } from '@/utils/is'

export const getOrderArray = () => {
    let orderArray: any = []
    if (isAuth('order:application:leave')) {
        orderArray.push({
            name: '请假申请',
            label: '请假申请',
            value: 1
        })
    }
    if (isAuth('order:application:trip')) {
        orderArray.push({
            name: '出差申请',
            label: '出差申请',
            value: 2
        })
    }
    if (isAuth('order:application:overtime')) {
        orderArray.push({
            name: '加班申请',
            label: '加班申请',
            value: 3
        })
    }
    if (isAuth('order:application:out')) {
        orderArray.push({
            name: '外出申请',
            label: '外出申请',
            value: 4
        })
    }
    if (isAuth('order:application:lend')) {
        orderArray.push({
            name: '物资外借',
            label: '物资外借',
            value: 5
        })
    }
    if (isAuth('order:application:use')) {
        orderArray.push({
            name: '物品领用',
            label: '物品领用',
            value: 6
        })
    }
    if (isAuth('order:application:stamp')) {
        orderArray.push({
            name: '用章申请',
            label: '用章申请',
            value: 7
        })
    }
    if (isAuth('order:application:buy')) {
        orderArray.push({
            name: '采购申请',
            label: '采购申请',
            value: 8
        })
    }
    if (isAuth('order:application:postpone')) {
        orderArray.push({
            name: '调休顺延申请',
            label: '调休顺延申请',
            value: 9
        })
    }
    if (isAuth('order:application:task')) {
        orderArray.push({
            name: '加班任务',
            label: '加班任务',
            value: 10
        })
    }
    return orderArray
}

export const getAllOrderArray = () => {
    let orderArray: any = [{
        name: '请假申请',
        label: '请假申请',
        value: '1'
    },
    {
        name: '出差申请',
        label: '出差申请',
        value: '2'
    },
    {
        name: '加班申请',
        label: '加班申请',
        value: '3'
    },
    {
        name: '外出申请',
        label: '外出申请',
        value: '4'
    },
    {
        name: '物资外借',
        label: '物资外借',
        value: '5'
    },
    {
        name: '物品领用',
        label: '物品领用',
        value: '6'
    },
    {
        name: '用章申请',
        label: '用章申请',
        value: '7'
    },
    {
        name: '采购申请',
        label: '采购申请',
        value: '8'
    },
    {
        name: '调休顺延申请',
        label: '调休顺延申请',
        value: 9
    },
    {
        name: '加班任务',
        label: '加班任务',
        value: 10
    }]

    return orderArray
}