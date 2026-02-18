package com.ebook.ebookapi.metodopago.modelo;

import com.ebook.ebookapi.orden.modelo.Orden;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "metodo_pago")
public class MetodoPago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String detalles;

    @Column(nullable = false)
    private String moneda;

    // Relación con órdenes (un método puede tener muchas órdenes)
    @OneToMany(mappedBy = "metodoPago")
    private List<Orden> ordenes; ///   PENDIENTE IR A ENTIDAD CATEGORIA SI DA ERROR :(

}
