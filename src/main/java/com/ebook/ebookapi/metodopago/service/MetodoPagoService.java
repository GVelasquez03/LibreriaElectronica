package com.ebook.ebookapi.metodopago.service;

import com.ebook.ebookapi.metodopago.Mapper.MapperPago;
import com.ebook.ebookapi.metodopago.Repository.MetodoPagoRepository;
import com.ebook.ebookapi.metodopago.dtos.MetodoPagoDTO;
import com.ebook.ebookapi.metodopago.modelo.MetodoPago;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MetodoPagoService implements IMetodoPago {

    private final MetodoPagoRepository metodoPagoRepository;

    // Inyeccion de dependencias
    public MetodoPagoService(MetodoPagoRepository metodoPagoRepository){
        this.metodoPagoRepository = metodoPagoRepository;
    }

    // Obtener todos los metodos de pago
    @Override
    public List<MetodoPagoDTO> listarTodos() {
        return metodoPagoRepository.findAll()
                .stream()
                .map(MapperPago::toDTO)
                .collect(Collectors.toList());
    }

    // Servicio obtener por identificador
    @Override
    public MetodoPagoDTO obtenerPorId(Long id) {
        MetodoPago metodoPago = metodoPagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));
        return MapperPago.toDTO(metodoPago);
    }

    // Crear un nuevo metodo de pago
    @Override
    public MetodoPagoDTO crear(MetodoPagoDTO metodoPagoDTO) {
        // convertir el metodoPagoDTO a entidad con Mapper antes de guardar
        MetodoPago metodoPago = MapperPago.toEntity(metodoPagoDTO);
        MetodoPago guardado = metodoPagoRepository.save(metodoPago);
        return MapperPago.toDTO(guardado);
    }

    // Actualizar Metodo de pago
    @Override
    @Transactional // Asegura que los cambios se persistan automáticamente
    public MetodoPagoDTO actualizar(Long id, MetodoPagoDTO metodoPagoDTO) {
        MetodoPago metodoPago = metodoPagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));

        MapperPago.actualizarEntidad(metodoPago, metodoPagoDTO);

        // 3. No hace falta llamar a repository.save() si usas @Transactional.
        // Hibernate detectará los cambios y hará el UPDATE por ti.
        return MapperPago.toDTO(metodoPago);
    }

    // Eliminar un metodo de pago
    @Override
    public String eliminar(Long id) {
        MetodoPago metodoPago = metodoPagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));

        metodoPagoRepository.delete(metodoPago);

        return "El Metodo de pago con el id: "+id+" fue eliminado";
    }

    @Override
    public MetodoPagoDTO convertirADTO(MetodoPago metodoPago) {
        return null;
    }
}
