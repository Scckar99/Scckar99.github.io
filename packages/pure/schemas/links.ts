import { z } from 'astro/zod'

export const FriendLinksSchema = () =>
  z
    .object({
      logbook: z.array(
        z.object({
          date: z.string(),
          content: z.string()
        })
      ),
      applyTip: z.array(
        z.object({
          name: z.string(),
          val: z.string()
        })
      )
    })
    .default({
      logbook: [],
      applyTip: [
        { name: 'Name', val: "Scckar's Blog" },
        { name: 'Desc', val: 'Stay hungry, stay foolish' },
        { name: 'Link', val: 'https://scckar99.github.io/' },
        { name: 'Avatar', val: 'https://scckar99.github.io/favicon/avatar.png' }
      ]
    })
    .describe('Friend links for your website.')
