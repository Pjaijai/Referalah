import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/config/site.ts";

export const metadata = siteConfig.page.about.metadata

const AboutPage = () => {
  return (
    <div className="container mt-12 p-0">
      <section>
        <h2 className="text-center text-4xl  font-bold sm:text-6xl">理念</h2>
        <h3 className="container mt-12 text-base">
          海外搵工好多時都需要人脈，有人推薦先有面試，而外地愈嚟愈多港人，但缺乏相關文化同平台。呢個平台喺俾大家搵翻同聲同氣嘅，無論你係藍領白領，都希望大家互相幫忙。
        </h3>
      </section>
      <Separator className="mt-12" />
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <h2 className="text-center text-4xl font-bold sm:text-6xl">
          如何運作？
        </h2>
        <div className="flex w-full flex-col justify-around md:flex-row">
          <div className="flex flex-col gap-4 text-center text-lg font-medium">
            <h3 className="text-xl font-semibold md:text-3xl">
              1.加入人脈網絡
            </h3>
            <h6>去個人檔案剔翻成為推薦人/受薦人。</h6>
            <h6>如果網絡中搵到有適合人選，直接聯絡。</h6>
            <h6>系統會Send訊息同埋對方電郵地址。</h6>
            <h6>你哋私底下聯絡，睇吓有冇得搞。</h6>
            <h6>祝一切順利！！</h6>
          </div>
          <Separator className="mt-12 block md:hidden" />
          <div className="mt-12 flex flex-col gap-4 text-center text-lg font-medium md:mt-0">
            <h3 className="text-xl font-semibold md:text-3xl">2.貼街招</h3>
            <h6>工作招聘網站見到合適工作/自己公司請人，想推薦香港人入。</h6>
            <h6>將相關連結放上嚟。</h6>
            <h6>睇吓有冇有緣人，如果有佢可以立即聯絡。</h6>
            <h6> 系統會Send訊息同埋對方電郵地址俾你。</h6>
            <h6>你哋私底下聯絡，睇吓有冇得搞。</h6>
            <h6>祝一切順利！！</h6>
          </div>
        </div>
      </section>
      <h2 className="mt-8 text-center text-sm font-bold">
        過程唔會收錢，希望呢個平台幫到大家！
      </h2>
      <h2 className="mt-8 text-center text-sm font-bold">
        Btw 聯絡me : r1r69.referalah@gmail.com
      </h2>
    </div>
  )
}

export default AboutPage
