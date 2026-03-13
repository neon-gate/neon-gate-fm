import { Card } from '@shadcn/components/ui/card'
// import { AiReasoning } from '@uploader/ui'
import { Uploader } from '@uploader/ui'

export default function UploaderSlot() {
  return (
    <Card className="mobile-hidden overflow-y-auto mr-2 glassy-surface surface col-span-2">
      <Uploader />
      {/* <AiReasoning /> */}
    </Card>
  )
}
