'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';
import { calculateTimeLeft } from '@/lib/utils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const { settings } = useSettings();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setTimeLeft(calculateTimeLeft(settings.weddingDate));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [settings.weddingDate]);

  if (!timeLeft) {
    return (
      <section className="py-24 px-4 bg-gradient-to-b from-luxury-beige/30 to-luxury-cream">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-script text-4xl md:text-5xl text-luxury-gold"
          >
            تمت الزفاف 🎉
          </motion.p>
        </div>
      </section>
    );
  }

  const items = [
    { label: 'يوم', value: timeLeft.days },
    { label: 'ساعة', value: timeLeft.hours },
    { label: 'دقيقة', value: timeLeft.minutes },
    { label: 'ثانية', value: timeLeft.seconds },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-luxury-beige/30 to-luxury-cream relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-luxury-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-luxury-rose/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto text-center"
      >
        <h2 className="font-script text-5xl md:text-6xl text-luxury-dark mb-4">
          العد التنازلي
        </h2>
        <p className="font-sans text-luxury-dark/60 mb-12">
          يتبقى على موعد فرحنا
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              <motion.span
                key={item.value}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="block font-serif text-4xl md:text-6xl text-luxury-gold mb-2"
              >
                {String(item.value).padStart(2, '0')}
              </motion.span>
              <span className="font-sans text-sm md:text-base text-luxury-dark/50">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 font-sans text-luxury-dark/40 text-sm"
        >
          {new Date(settings.weddingDate).toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </motion.p>
      </motion.div>
    </section>
  );
}
