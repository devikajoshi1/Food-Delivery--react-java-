package com.food.service;

import com.food.dto.OrderRequest;
import com.food.model.*;
import com.food.repository.MenuItemRepository;
import com.food.repository.OrderRepository;
import com.food.repository.RestaurantRepository;
import com.food.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    public static final List<String> STATUSES = List.of("PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED");
    public static final List<String> PAYMENT_METHODS = List.of("COD", "UPI", "CARD");


    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
                        RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public Order placeOrder(String email, OrderRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Restaurant restaurant = restaurantRepository.findById(request.restaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        Order order = new Order();
        order.setUser(user);
        order.setCustomerName(user.getName());
        order.setRestaurantId(restaurant.getId());
        order.setRestaurantName(restaurant.getName());
        order.setAddress(request.address());
        order.setStatus("PLACED");
        
        order.setCreatedAt(LocalDateTime.now());

        if (!PAYMENT_METHODS.contains(request.paymentMethod())) {
            throw new RuntimeException("Invalid payment method");
        }
        order.setPaymentMethod(request.paymentMethod());
        // Cash is paid later, at the door. UPI and Card are paid now.
        order.setPaymentStatus(request.paymentMethod().equals("COD") ? "PENDING" : "PAID");


        double total = 0;
        for (OrderRequest.Item cartItem : request.items()) {
            if (cartItem.quantity() < 1) {
                throw new RuntimeException("Quantity must be at least 1");
            }
            // Price always comes from the database, never from the browser
            MenuItem menuItem = menuItemRepository.findById(cartItem.menuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));
            if (!menuItem.getRestaurant().getId().equals(restaurant.getId())) {
                throw new RuntimeException("All items must be from the same restaurant");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setItemName(menuItem.getName());
            orderItem.setPrice(menuItem.getPrice());
            orderItem.setQuantity(cartItem.quantity());
            order.getItems().add(orderItem);

            total += menuItem.getPrice() * cartItem.quantity();
        }
        order.setTotalAmount(total);

        return orderRepository.save(order);
    }

    public List<Order> getMyOrders(String email) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(email);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateStatus(Long orderId, String status) {
        if (!STATUSES.contains(status)) {
            throw new RuntimeException("Invalid status");
        }
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        // Cash on Delivery is collected when the food arrives
        if (status.equals("DELIVERED") && "COD".equals(order.getPaymentMethod())) {
            order.setPaymentStatus("PAID");
        }
        return orderRepository.save(order);
    }
}
