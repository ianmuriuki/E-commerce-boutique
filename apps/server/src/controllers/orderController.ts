import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { OrderService } from '../services/orderService';
import { AuthRequest } from '../middlewares/auth';

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await OrderService.createOrder(req.body);
  sendSuccess(res, 'Order created successfully', order, 201);
});

export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const query = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    status: req.query.status as string,
    paymentStatus: req.query.paymentStatus as string,
    customer: req.query.customer as string,
    startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
    endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
  };

  const result = await OrderService.getOrders(query);
  sendSuccess(res, 'Orders retrieved successfully', result.orders, 200, result.pagination);
});

export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const order = await OrderService.getOrderById(req.params.id);
  sendSuccess(res, 'Order retrieved successfully', order);
});

export const getOrderByNumber = catchAsync(async (req: Request, res: Response) => {
  const order = await OrderService.getOrderByNumber(req.params.orderNumber);
  sendSuccess(res, 'Order retrieved successfully', order);
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const order = await OrderService.updateOrderStatus(req.params.id, status);
  sendSuccess(res, 'Order status updated successfully', order);
});

export const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { paymentStatus, paymentId } = req.body;
  const order = await OrderService.updatePaymentStatus(req.params.id, paymentStatus, paymentId);
  sendSuccess(res, 'Payment status updated successfully', order);
});

export const getUserOrders = catchAsync(async (req: AuthRequest, res: Response) => {
  const query = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    status: req.query.status as string,
    startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
    endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
  };

  const result = await OrderService.getUserOrders(req.user!._id.toString(), query);
  sendSuccess(res, 'User orders retrieved successfully', result.orders, 200, result.pagination);
});

export const getOrderStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await OrderService.getOrderStats();
  sendSuccess(res, 'Order statistics retrieved successfully', stats);
});