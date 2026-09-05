export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  const { checkDeployment } = await import("./app/_lib/deployment")

  for (const { nivel, mensagem } of checkDeployment()) {
    const prefixo = nivel === "erro" ? "[config: ERRO]" : "[config: aviso]"
    if (nivel === "erro") {
      console.error(prefixo, mensagem)
    } else {
      console.warn(prefixo, mensagem)
    }
  }
}
