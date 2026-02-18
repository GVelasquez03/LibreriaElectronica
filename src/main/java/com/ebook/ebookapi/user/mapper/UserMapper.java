package com.ebook.ebookapi.user.mapper;

import com.ebook.ebookapi.user.dtos.RegisterRequest;
import com.ebook.ebookapi.user.modelo.Role;
import com.ebook.ebookapi.user.modelo.Usuario;

public class UserMapper {

    // Convertir un dto a un Usuario
    public static Usuario toEntity(RegisterRequest registerRequest){
        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(registerRequest.getNombreCompleto());
        usuario.setEmail(registerRequest.getEmail());
        usuario.setFechaNacimiento(registerRequest.getFechaNacimiento());
        usuario.setPassword(registerRequest.getPassword());
        usuario.setPais(registerRequest.getPais());
        usuario.setRole(Role.USER);
        usuario.setVerified(false);

        return usuario;
    }

    // Convertir un usuario a un dto
    public static RegisterRequest toDto(Usuario usuario){
        RegisterRequest usuarioDto = new RegisterRequest();
        usuarioDto.setEmail(usuario.getEmail());
        usuarioDto.setNombreCompleto(usuario.getNombreCompleto());
        usuarioDto.setPassword(usuario.getPassword());
        usuarioDto.setPais(usuario.getPais());
        usuarioDto.setFechaNacimiento(usuario.getFechaNacimiento());
        usuarioDto.setVerificationToken(usuario.getVerificationToken());

        return  usuarioDto;
    }

}
