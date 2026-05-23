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
    const files = await request.files();
    const urls: string[] = [];

    for await (const data of files) {
      const extension = data.filename.split(".").pop(); // Pega a extensão do arquivo
      const imageName = `${randomUUID()}.${extension}`; // Gera um nome único para o arquivo
      const buffer = await data.toBuffer(); // Pega o buffer do arquivo

      await minioClient.putObject(
        BUCKET_NAME,
        imageName,
        buffer,
        buffer.length,
        {
          "Content-Type": data.mimetype,
        },
      ); // Faz o upload do arquivo no MinIO
      const imageUrl = `http://localhost:9000/${BUCKET_NAME}/${imageName}`; // Gera a URL da imagem

      urls.push(imageUrl);
    }

    if (urls.length === 0) {
      return reply.status(400).send({ message: "No images uploaded." });
    }

    return reply.status(201).send({ urls });
  } catch (error) {
    console.error("Erro no upload:", error);
    return reply
      .status(500)
      .send({ message: "Erro ao fazer upload da imagem." });
  }
};
