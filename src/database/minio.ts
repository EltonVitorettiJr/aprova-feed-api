import * as Minio from "minio";

// Mesmas credenciais usadas no docker-compose
export const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "admin",
  secretKey: "password123",
});

export const BUCKET_NAME = "aprovafeed-images";

// Função para garantir que o bucket existe quando o servidor ligar
export async function setupMinio() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, "us-east-1");

      // Deixa o bucket público para o frontend conseguir carregar as URLs das imagens depois
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["s3:GetObject"],
            Effect: "Allow",
            Principal: "*",
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      };
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
      console.log(`🪣 Bucket '${BUCKET_NAME}' criado com sucesso no MinIO!`);
    } else {
      console.log(`🪣 Bucket '${BUCKET_NAME}' já existe. Pronto para uso.`);
    }
  } catch (error) {
    console.error("❌ Erro ao configurar o MinIO:", error);
  }
}
