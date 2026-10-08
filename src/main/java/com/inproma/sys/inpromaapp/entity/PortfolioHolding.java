package com.inproma.sys.inpromaapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "portfolio_holdings")
public class PortfolioHolding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String tickerSymbol;
    private Double quantity;
    private Double currentUnitPrice;

    public PortfolioHolding() {}

    public PortfolioHolding(Long userId, String tickerSymbol, Double quantity, Double currentUnitPrice) {
        this.userId = userId;
        this.tickerSymbol = tickerSymbol;
        this.quantity = quantity;
        this.currentUnitPrice = currentUnitPrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTickerSymbol() {
        return tickerSymbol;
    }

    public void setTickerSymbol(String tickerSymbol) {
        this.tickerSymbol = tickerSymbol;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getCurrentUnitPrice() {
        return currentUnitPrice;
    }

    public void setCurrentUnitPrice(Double currentUnitPrice) {
        this.currentUnitPrice = currentUnitPrice;
    }

    public Object getUser() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUser'");
    }

    public Object getCategory() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getCategory'");
    }
}