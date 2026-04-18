import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function Page() {
  return (
    <>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover</Button>} />
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
