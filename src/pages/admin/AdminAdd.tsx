import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Book } from "../../types/book";
import { createBook } from "../../services/bookService";
import Swal from "sweetalert2";


export default function AdminAdd() {
    const navigate = useNavigate();

    const [form, setForm] = useState<Omit<Book, "id">>({
        title: "",
        author: "",
        description: "",
        category: "",
        cover: "",
        price: 0,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title || !form.author || !form.category || !form.cover) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor completa todos los campos obligatorios",
                background: "#0f172a",
                color: "#fff",
                confirmButtonColor: "#f59e0b",
            });
            return;
        }   


        try {
            setLoading(true);
            await createBook(form);
            Swal.fire({
                icon: "success",
                title: "Libro añadido",
                text: "El libro se registró correctamente",
                background: "#0f172a",
                color: "#ffffff",
                confirmButtonColor: "#f59e0b",
                timer: 1800,
                showConfirmButton: false,
            }).then(() => {
                navigate("/admin");
            });

        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo guardar el libro",
                background: "#0f172a",
                color: "#fff",
                confirmButtonColor: "#f59e0b",
            });             
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black px-4">
            <div className="w-full max-w-3xl bg-zinc-900/90 backdrop-blur border border-violet-500/30 rounded-2xl shadow-[0_0_40px_#735CDB80] p-6">

                <h2 className="text-2xl font-semibold text-[#735CDB] mb-6 text-center">
                    Agregar libro
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

                    <Input label="Título" name="title" value={form.title} onChange={handleChange} />
                    <Input label="Autor" name="author" value={form.author} onChange={handleChange} />

                    <Input label="Categoría" name="category" value={form.category} onChange={handleChange} />
                    <Input label="Precio" name="price" type="number" value={form.price} onChange={handleChange} />

                    <Input
                        label="URL Portada"
                        name="cover"
                        value={form.cover}
                        onChange={handleChange}
                        className="col-span-2"
                    />

                    {/* DESCRIPCIÓN */}
                    <div className="col-span-2">
                        <label className="block text-sm text-[#735CDB] mb-1">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            rows={2}
                            value={form.description}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white text-sm focus:ring-2 focus:ring-[#735CDB] focus:outline-none"
                        />
                    </div>

                    {/* BOTONES */}
                    <div className="col-span-2 flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin")}
                            className="px-5 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white transition"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-lg bg-[#735CDB] hover:bg-[#5f4bc7] text-white font-semibold transition shadow-[0_0_20px_#735CDB80] disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );

}

interface InputProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    className?: string;
}

function Input({
    label,
    name,
    value,
    onChange,
    type = "text",
    className = "",
}: InputProps) {
    return (
        <div className={className}>
            <label className="block text-sm text-[#735CDB] mb-1">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white text-sm focus:ring-2 focus:ring-[#735CDB] focus:outline-none"
            />
        </div>
    );
}


