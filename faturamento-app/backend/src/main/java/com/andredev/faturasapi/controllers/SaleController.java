package com.andredev.faturasapi.controllers;

import com.andredev.faturasapi.entities.Sale;
import com.andredev.faturasapi.services.SaleService;
import com.andredev.faturasapi.services.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(value = "/sales")
public class SaleController {

    @Autowired
    private SaleService service;

    @Autowired
    private SmsService smsService;

    @GetMapping
    public Page<Sale> findSales(
            @RequestParam(value="minDate", defaultValue = "") String minDate,
            @RequestParam(value="maxDate", defaultValue = "") String maxDate,
            Pageable pageable)
    {
        return service.findSales(minDate, maxDate, pageable);
    }

    @PostMapping
    public Sale insertSales(@RequestBody Sale sale){
        return service.insertSale(sale);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<String> putSale(@RequestBody Sale sale, @PathVariable Long id){
        Optional<Sale> saleOptional = service.findById(id);
        if(!saleOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sale not found");
        }
        return service.putSale(sale, id);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Object> deleteSale(@PathVariable Long id){
        Optional<Sale> saleOptional = service.findById(id);
        if(!saleOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sale not found");
        }
        return service.deleteService(id);
    }

    @GetMapping("/{id}/notification")
    public void notifySms(@PathVariable Long id){
        smsService.sendSms(id);
    }

}
