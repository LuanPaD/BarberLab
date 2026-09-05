/**
 * Roda uma vez, quando o servidor sobe. Serve para gritar cedo sobre a
 * configuração de ambiente — é mais barato descobrir aqui do que depois de o
 * primeiro cliente entrar. Quando o Sentry entrar, `onRequestError` mora aqui.
 */
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
