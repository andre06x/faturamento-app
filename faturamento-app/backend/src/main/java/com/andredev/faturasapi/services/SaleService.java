package com.andredev.faturasapi.services;

import com.andredev.faturasapi.entities.Sale;
import com.andredev.faturasapi.repositories.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;

@Service
public class SaleService {

    @Autowired
    private SaleRepository repository;

    public Page<Sale> findSales(String minDate, String maxDate, Pageable pageable) {

        LocalDate today = LocalDate.ofInstant(Instant.now(), ZoneId.systemDefault());


        LocalDate min = minDate.equals("") ? today.minusDays(365) : LocalDate.parse(minDate);
        LocalDate max = maxDate.equals("") ? today : LocalDate.parse(maxDate);

        return repository.findSales(min, max, pageable);
    }

    public Sale insertSale(Sale sale) {
        return repository.save(sale);
    }

    public ResponseEntity<String> putSale(Sale sale, Long id) {
        repository.findById(id).map(salePut -> {
            salePut.setAmount(sale.getAmount());
            salePut.setDate(sale.getDate());
            salePut.setDeals(sale.getDeals());
            salePut.setVisited(sale.getVisited());
            salePut.setSellerName(sale.getSellerName());
            return repository.save(salePut);
        });
        return ResponseEntity.status(HttpStatus.OK).body("Sale update");
    }

    public ResponseEntity<Object> deleteService(Long id) {
        repository.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Sale deleted");
    }

    public Optional<Sale> findById(Long id) {
        return repository.findById(id);
    }
}
