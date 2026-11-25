package com.food.controller;

import com.food.dto.OrderRequest;
import com.food.model.Order;
import com.food.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order placeOrder(@Valid @RequestBody OrderRequest request, Authentication auth){
        //auth.getname() is the email take from the jwt

        return orderService.placeOrder(auth.getName(), request);
    }

    @GetMapping("/my")
    public List<Order>  myOrders(Authentication auth){
        return orderService.getMyOrders(auth.getName());
    }
}