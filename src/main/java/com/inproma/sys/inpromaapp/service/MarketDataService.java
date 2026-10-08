package com.inproma.sys.inpromaapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class MarketDataService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${finnhub.api.key:YOUR_FINNHUB_API_KEY}")
    private String finnhubApiKey;

    public Double getLivePrice(String tickerSymbol) {
        if (finnhubApiKey == null || finnhubApiKey.equals("YOUR_FINNHUB_API_KEY")) {
            System.err.println("Finnhub API key not configured in application.properties.");
            return null;
        }

        try {
            String symbol = tickerSymbol.trim().toUpperCase();
            String url = String.format("https://finnhub.io/api/v1/quote?symbol=%s&token=%s", symbol, finnhubApiKey);

            Map<?, ?> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("c")) {
                Number currentPrice = (Number) response.get("c");
                if (currentPrice != null && currentPrice.doubleValue() > 0) {
                    return currentPrice.doubleValue();
                }
            }
        } catch (Exception e) {
            System.err.println("Finnhub lookup failed for symbol '" + tickerSymbol + "': " + e.getMessage());
        }
        return null;
    }
}