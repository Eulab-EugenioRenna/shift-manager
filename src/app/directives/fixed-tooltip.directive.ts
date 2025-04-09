import { Directive, Input, TemplateRef } from "@angular/core";
import { Tooltip, TooltipStyle } from "primeng/tooltip";

@Directive({
  selector: '[pTooltipFixed]',
  standalone: true,
  providers: [TooltipStyle]
})
export class FixedTooltipDirective extends Tooltip {
  @Input('pTooltipFixed') override content: string | TemplateRef<HTMLElement> | undefined;

  override onInputClick(e: Event) {
    this.activate();
  }
}
