package com.food.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter

public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String customerName;
    private Long restaurantId;
    private String restaurantName;
    private String address;
    private double totalAmount;

    //placed,preparing,outfordelevery,delivered
    private String status;

    private LocalDateTime createdAt;

    // COD, UPI or CARD
    private String paymentMethod;

    // PAID (UPI / Card) or PENDING (Cash on Delivery)
    private String paymentStatus;


    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items = new ArrayList<>();


}