package com.ebook.ebookapi.orden.service;

import com.ebook.ebookapi.book.modelo.Book;
import com.ebook.ebookapi.book.repository.BookRepository;
import com.ebook.ebookapi.metodopago.Repository.MetodoPagoRepository;
import com.ebook.ebookapi.metodopago.modelo.MetodoPago;
import com.ebook.ebookapi.orden.Mapper.OrdenMapper;
import com.ebook.ebookapi.orden.Repository.OrdenRepository;
import com.ebook.ebookapi.orden.dtos.OrdenDTO;
import com.ebook.ebookapi.orden.dtos.OrdenRequest;
import com.ebook.ebookapi.orden.modelo.Orden;
import com.ebook.ebookapi.user.modelo.Usuario;
import com.ebook.ebookapi.user.repositorioUsuario.UsuarioRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrdenService implements IOrdenService {
    private final OrdenRepository ordenRepository;
    private final UsuarioRepositorio usuarioRepositorio;
    private final BookRepository bookRepository;
    private final MetodoPagoRepository metodoPagoRepository;

    // Inyeccion de dependencias
    public OrdenService(OrdenRepository ordenRepository, UsuarioRepositorio usuarioRepositorio,
        BookRepository bookRepository,MetodoPagoRepository metodoPagoRepository){
        this.ordenRepository = ordenRepository;
        this.usuarioRepositorio = usuarioRepositorio;
        this.bookRepository = bookRepository;
        this.metodoPagoRepository = metodoPagoRepository;
    }

    // Obtener todas las órdenes
    @Override
    public List<OrdenDTO> listarTodas() {
        return ordenRepository.findAll()
                .stream()
                .map(OrdenMapper:: toDTO)
                .collect(Collectors.toList());
    }

    // Obtener una orden por identificador
    @Override
    public OrdenDTO obtenerPorId(Long id) {
       Orden orden = ordenRepository.findById(id)
               .orElseThrow(()-> new RuntimeException("Error orden no encontrada"));
        return OrdenMapper.toDTO(orden);
    }

    // Listar orden por usuario
    @Override
    public List<OrdenDTO> listarPorUsuario(Long idUsuario) {
        Usuario usuario = usuarioRepositorio.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ordenRepository.findByUsuario(usuario)
                .stream()
                .map(OrdenMapper:: toDTO)
                .collect(Collectors.toList());
    }

    // Servicio para crear una orden
    @Override
    @Transactional
    public OrdenDTO crearOrden(OrdenRequest request) {
        Usuario usuario = usuarioRepositorio.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Book libro = bookRepository.findById(request.getIdLibro())
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        MetodoPago metodoPago = metodoPagoRepository.findById(request.getIdMetodoPago())
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));

        // Creando orden
        Orden orden = OrdenMapper.ordenTransformation(usuario,libro,metodoPago);
        orden.setMontoTotal(request.getMontoTotal());

        Orden guardada = ordenRepository.save(orden);
        return OrdenMapper.toDTO(orden);

    }

    @Override
    @Transactional
    public OrdenDTO actualizarEstado(Long id, String nuevoEstado) {
        Orden orden = ordenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        orden.setEstado(nuevoEstado);
        Orden actualizada = ordenRepository.save(orden);
        return OrdenMapper.toDTO(actualizada);
    }
}
