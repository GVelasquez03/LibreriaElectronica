package com.ebook.ebookapi.metodopago.Repository;

import com.ebook.ebookapi.metodopago.modelo.MetodoPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetodoPagoRepository extends JpaRepository<MetodoPago,Long> {
}
