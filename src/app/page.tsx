'use client'

import Link from "next/link"
import { Heart, MessageCircle, Moon, Shield, Lightbulb, ArrowRight } from "lucide-react"
import { WelcomeBanner } from "@/components/layout/WelcomeBanner"
import { AuthPromptModal } from "@/components/modals/AuthPromptModal"
import { HistoryModal } from "@/components/modals/HistoryModal"
import { EducationModal } from "@/components/education/EducationModal"
import { StartChatButton } from "@/components/layout/StartChatButton"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-rose-50">
      <WelcomeBanner />
      <AuthPromptModal />
      <HistoryModal />
      <EducationModal />

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-right order-2 lg:order-1">
              <div className="inline-flex items-center justify-center space-x-reverse space-x-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full mb-6">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">همراه تراپیست هوشمند شما</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                فضایی امن برای
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                  {" "}درد و دل
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                من Niora هستم، همراه تراپیست شما. اینجا می‌تونی بدون قضاوت، هر چی تو دلته رو بگی.
                من گوش می‌دم، می‌فهمم و کمکت می‌کنم مسائل رو حل کنی.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-reverse space-x-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold text-gray-800 mb-1">فضای امن و محرمانه</h3>
                    <p className="text-sm text-gray-600">همه چی کاملاً خصوصی می‌مونه</p>
                  </div>
                </div>

                <div className="flex items-start space-x-reverse space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold text-gray-800 mb-1">گوش دادن فعال</h3>
                    <p className="text-sm text-gray-600">من همیشه آماده شنیدنتم</p>
                  </div>
                </div>

                <div className="flex items-start space-x-reverse space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold text-gray-800 mb-1">راهکار عملی</h3>
                    <p className="text-sm text-gray-600">راه حل‌های کاربردی برای مشکلات</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <StartChatButton />
            </div>

            {/* Image/Illustration */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-rose-200 to-pink-200 rounded-3xl blur-2xl opacity-30"></div>
                <div className="relative bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 border border-rose-100">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Heart className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Niora</h3>
                    <p className="text-gray-600 mb-6">همراه تراپیست شما</p>
                    <div className="flex justify-center space-x-reverse space-x-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-rose-500">۲۴/۷</div>
                        <div className="text-xs text-gray-500">همیشه در دسترس</div>
                      </div>
                      <div className="w-px bg-gray-200"></div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-pink-500">۱۰۰٪</div>
                        <div className="text-xs text-gray-500">خصوصی و امن</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">خدمات ما</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Therapy Card */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center space-x-reverse space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">تراپی</h3>
              </div>
              <p className="text-gray-600 mb-4">
                همراه تراپیست هوشمند که باهات صحبت می‌کنه، گوش می‌ده و راه‌حل‌های کاربردی برای مشکلاتت ارائه می‌ده.
              </p>
              <StartChatButton variant="secondary" />
            </div>

            {/* Moon Flow Card */}
            <Link
              href="/moonflow"
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-reverse space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Moon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Moon Flow 🌙</h3>
              </div>
              <p className="text-gray-600 mb-4">
                فضای شخصی و محرمانه برای حمایت از شما در دوران قاعدگی و PMS با پیشنهادات تخصصی.
              </p>
              <div className="flex items-center text-purple-500 group-hover:text-purple-600">
                <span className="ml-2">کشف کنید</span>
                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rose-100 py-8 px-4">
        <div className="container mx-auto text-center text-gray-600">
          <p>ساخته شده با ❤️ برای حمایت از سلامت روان</p>
        </div>
      </footer>
    </div>
  )
}
