import { randomUUID } from "node:crypto"; // Para gerar nomes únicos para os arquivos
import type { FastifyReply, FastifyRequest } from "fastify";
import { BUCKET_NAME, minioClient } from "../../database/minio.js";
import "@fastify/multipart";

export const uploadImageController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    // Pega o arquivo enviado no formato multipart
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ message: "Nenhuma imagem foi enviada." });
    }

    // Gera um nome único para não sobrescrever fotos com o mesmo nome
    const extension = data.filename.split(".").pop();
    const fileName = `${randomUUID()}.${extension}`;

    // Transforma o stream de dados da imagem em um buffer
    const buffer = await data.toBuffer();

    // Faz o upload direto pro container do MinIO
    await minioClient.putObject(
      BUCKET_NAME,
      fileName,
      buffer, // O stream de dados da imagem
      buffer.length,
      { "Content-Type": data.mimetype }, // Avisa se é png, jpeg, etc
    );

    // Constrói a URL pública da imagem para você salvar no MongoDB depois!
    const imageUrl = `http://localhost:9000/${BUCKET_NAME}/${fileName}`;

    return reply.status(201).send({ url: imageUrl });
  } catch (error) {
    console.error("Erro no upload:", error);
    return reply
      .status(500)
      .send({ message: "Erro ao fazer upload da imagem." });
  }
};
