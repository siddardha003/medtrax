import React, { useState, useRef, useEffect } from 'react';
import '../css/Baby.css';

const BabyDevelopmentTracker = () => {
    const [selectedWeek, setSelectedWeek] = useState(4);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const sliderRef = useRef(null);


    const weekData = [
        {
            week: 4,
            fruit: "Poppy Seed",
            details: "Your baby is a tiny poppy seed and you won’t feel anything at all.",
            structure: "Height: 0.4 cms & Weight: 0.4 gms",
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6621fefc02af15231c48df1b/poppy-seed.png",
            symptoms: [
                {
                    title: "Implantation Bleeding",
                    description: "If you find some spotting then don’t be alarmed. This is a sign that the embryo has implanted itself into the uterine wall."
                },
                {
                    title: "PMS-ing",
                    description: "Your hormones are on a high rise and as a result you will go through moodiness, bloating, and mild cramps."
                },
                {
                    title: "Sore Breast",
                    description: "You might feel breast tenderness. This is due to hormonal changes in your body."
                }
            ],
            tips: [
                "Start eating a snack first thing in the morning and consider asking your partner to prepare food for you.",
                "Get your Vitamin D to build and maintain healthy bones.",
                "Start taking your prenatal vitamin in the morning which will help you with morning sickness."
            ]
        },
        {
            week: 5,
            fruit: "Orange Seed",
            details: "Happy monthiversary! Your baby is now a month old and is the shape of an orange seed.",
            structure: "Height: 0.7 cms & Weight: 0.7 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66225d0701189287956c4de3/orange-seed.png",
            symptoms: [
                {
                    title: "Food Cravings",
                    description: "Welcome to the world of weird food cravings but you need to balance both."
                },
                {
                    title: "Nausea",
                    description: "The queasy feeling in your stomach can lead to vomiting at any hour of the day."
                },
                {
                    title: "Excessive Saliva",
                    description: "Along with uneasiness in the stomach, your mouth will be watery all the time for no reason at all."
                }
            ],
            tips: [
                "Add nutrient-dense food to your diet, especially omega-3 fatty acids.",
                "Avoid certain foods that can harm your baby such as seafood, alcohol.",
                "Break your caffeine consumption."
            ]
        },
        {
            week: 6,
            fruit: "Pomegranate Seed",
            details: "Your baby is now a pomegranate seed with a tail and a curved shape.",
            structure: "Height: 0.8 cms & Weight: 0.8 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6621ff60dc67f912f76a0dc5/pomegranate-seed.png",
            symptoms: [
                {
                    title: "Breast Changes",
                    description: "Your breasts are getting bigger and your nipples are sticking out more than usual."
                },
                {
                    title: "Fatigue",
                    description: "Being pregnant is not easy. Take it easy and rest as you will feel extreme exhaustion."
                },
                {
                    title: "Gas and Bloating",
                    description: "Because of the increase in progesterone, you might feel gassy or bloated most of the time."
                }
            ],
            tips: [
                "Prepare for your first prenatal doctor appointment. Ask even the silliest question.",
                "Skip the hot bath as it can increase the risk of miscarriage.",
                "Drink plenty of water and urinate as and when required to avoid UTI and eat small frequent meals."
            ]
        },
        {
            week: 7,
            fruit: "Blueberry",
            details: "Your baby is now a blueberry and eyes, nose and ears begin to develop.",
            structure: "Height: 0.9 cms & Weight: 0.9 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661a17a50144fd56908d6eb0/4.png",
            symptoms: [
                {
                    title: "Frequent Urination",
                    description: "You will spend a lot of time in the bathroom now due to urination caused by hormonal changes."
                },
                {
                    title: "Acne Breakout",
                    description: "Blame your hormones for this. Check with your doctor before applying any anti-acne cream."
                },
                {
                    title: "Heartburn and Indigestion",
                    description: "You may feel a burning sensation in your body. Avoid heartburn trigger foods like spicy or fatty foods."
                }
            ],
            tips: [
                "Start prenatal exercise and keep yourself moving.",
                "Get all the check-ups and diagnosis done.",
                "Wash your face and use SPF30+ when you step out."
            ]
        },
        {
            week: 8,
            fruit: "Raspberry",
            details: "Your baby is now the size of a raspberry, with small limbs beginning to form.",
            structure: "Height: 1.1 cms & Weight: 1.2 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6622009d6a890b12fea36080/raspberry.png",
            symptoms: [
                {
                    title: "Morning Sickness",
                    description: "You may still feel nauseous, especially in the morning, but it should start to improve soon."
                },
                {
                    title: "Mood Swings",
                    description: "Your emotions might be all over the place due to hormonal changes."
                },
                {
                    title: "Increased Urination",
                    description: "Your body is processing more fluids, so you may feel the need to urinate more often."
                }
            ],
            tips: [
                "Eat small meals throughout the day to manage nausea.",
                "Get plenty of rest and take breaks as needed.",
                "Stay hydrated to help with morning sickness."
            ]
        },
        {
            week: 9,
            fruit: "Cherry",
            details: "Your baby is now the size of a cherry, and major organs are forming.",
            structure: "Height: 1.2 cms & Weight: 1.8 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e3cb7ca5e81d9d96c2a2d/6.png",
            symptoms: [
                {
                    title: "Fatigue",
                    description: "You may feel more tired than usual as your body is working hard to support the pregnancy."
                },
                {
                    title: "Increased Appetite",
                    description: "You might find yourself feeling hungrier as your body needs more energy."
                },
                {
                    title: "Food Aversions",
                    description: "Certain foods might start to seem unappealing, and some smells may trigger nausea."
                }
            ],
            tips: [
                "Eat a balanced diet with plenty of fruits and vegetables.",
                "Take naps during the day to help with fatigue.",
                "Avoid strong smells that make you feel nauseous."
            ]
        },
        {
            week: 10,
            fruit: "Strawberry",
            details: "Your baby is now the size of a strawberry, with developing fingers and toes.",
            structure: "Height: 1.5 cms & Weight: 2.5 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e3ffa29c2c74d91bc6f07/7.png",
            symptoms: [
                {
                    title: "Bloating",
                    description: "You may experience bloating due to hormonal changes affecting your digestive system."
                },
                {
                    title: "Increased Saliva",
                    description: "You might notice more saliva in your mouth, a common pregnancy symptom."
                },
                {
                    title: "Breast Tenderness",
                    description: "Your breasts may feel sore and tender as your body adjusts to pregnancy."
                }
            ],
            tips: [
                "Wear a comfortable bra to relieve breast tenderness.",
                "Avoid carbonated drinks to reduce bloating.",
                "Stay active with light exercises to improve digestion."
            ]
        },
        {
            week: 11,
            fruit: "Brussels Sprout",
            details: "Your baby is now the size of a brussels sprout, and facial features are becoming more defined.",
            structure: "Height: 2.0 cms & Weight: 3.5 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e403015489e4cf500a33c/8.png",
            symptoms: [
                {
                    title: "Constipation",
                    description: "Your body is producing more progesterone, which can slow down digestion."
                },
                {
                    title: "Heartburn",
                    description: "You may experience heartburn as your body adjusts to pregnancy."
                },
                {
                    title: "Increased Blood Flow",
                    description: "You may notice that your skin looks more flushed due to increased blood flow."
                }
            ],
            tips: [
                "Eat high-fiber foods to help with constipation.",
                "Avoid spicy foods to reduce heartburn.",
                "Wear loose, comfortable clothing to help with increased blood flow."
            ]
        },
        {
            week: 12,
            fruit: "Passion fruit",
            details: "Your baby is now the size of a passion fruit, and vital organs are almost fully formed.",
            structure: "Height: 2.5 cms & Weight: 5.5 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/662200341ab82eab268bb921/plum.png",
            symptoms: [
                {
                    title: "Morning Sickness",
                    description: "Morning sickness should start to subside around this time."
                },
                {
                    title: "Mood Swings",
                    description: "Hormonal fluctuations can lead to mood swings."
                },
                {
                    title: "Increased Urination",
                    description: "You may feel the need to urinate more frequently as your uterus grows."
                }
            ],
            tips: [
                "Continue taking prenatal vitamins to support your baby's development.",
                "Drink plenty of water to stay hydrated.",
                "Take short walks to improve circulation and reduce swelling."
            ]
        },
        {
            week: 13,
            fruit: "Lemon",
            details: "Your baby is now the size of a lemon, and facial features are becoming more distinct.",
            structure: "Height: 3.0 cms & Weight: 7.4 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6622005f7764da138dee9dc6/lemon.png",
            symptoms: [
                {
                    title: "Increased Energy",
                    description: "You might feel a burst of energy as the first trimester symptoms begin to subside."
                },
                {
                    title: "Visible Veins",
                    description: "You may notice more visible veins as your blood volume increases."
                },
                {
                    title: "Mild Cramping",
                    description: "Mild cramping is normal as your uterus expands to accommodate your growing baby."
                }
            ],
            tips: [
                "Try gentle exercise like walking or swimming to keep your energy up.",
                "Stay hydrated and avoid standing for long periods.",
                "Wear loose clothing to help with the increase in blood volume."
            ]
        },
        {
            week: 14,
            fruit: "Peach",
            details: "Your baby is now the size of a peach, and its body is starting to look more human-like.",
            structure: "Height: 4.0 cms & Weight: 10 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6622008318ac0c7603d3e071/peach.png",
            symptoms: [
                {
                    title: "Growing Belly",
                    description: "Your belly might start to show as your baby grows, but it may still be subtle."
                },
                {
                    title: "Skin Changes",
                    description: "Hormonal changes can cause changes in your skin, such as a pregnancy glow or darkened areas."
                },
                {
                    title: "Increased Appetite",
                    description: "You might feel hungrier as your body needs more nutrients for both you and your baby."
                }
            ],
            tips: [
                "Eat a variety of foods to ensure you’re getting all the nutrients you need.",
                "Use sunscreen to protect your skin from pregnancy-related pigmentation.",
                "Stay active to maintain a healthy weight gain."
            ]
        },
        {
            week: 15,
            fruit: "Grape fruit",
            details: "Your baby is now the size of an grape fruit, and its bones are starting to harden.",
            structure: "Height: 5.0 cms & Weight: 15 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e40f9985dbe4d8a718fba/12.png",
            symptoms: [
                {
                    title: "Heartburn",
                    description: "Hormonal changes and the growing uterus may lead to heartburn."
                },
                {
                    title: "Back Pain",
                    description: "You may start experiencing some back pain as your body adjusts to the growing baby."
                },
                {
                    title: "Frequent Urination",
                    description: "You may find yourself needing to urinate more frequently as your uterus expands."
                }
            ],
            tips: [
                "Avoid spicy and fatty foods to reduce heartburn.",
                "Practice good posture to relieve back pain.",
                "Stay hydrated to avoid urinary tract infections."
            ]
        },
        {
            week: 16,
            fruit: "Avocado",
            details: "Your baby is now the size of an avocado, and its limbs are becoming more defined.",
            structure: "Height: 6.0 cms & Weight: 20 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66220ad623646baac7098771/avocado.png",
            symptoms: [
                {
                    title: "Increased Energy",
                    description: "You may feel a surge of energy as you move into the second trimester."
                },
                {
                    title: "Visible Veins",
                    description: "Your veins may become more prominent due to the increased blood flow."
                },
                {
                    title: "Nasal Congestion",
                    description: "Pregnancy hormones can cause nasal congestion, making it hard to breathe through your nose."
                }
            ],
            tips: [
                "Use a humidifier to relieve nasal congestion.",
                "Continue to eat nutrient-dense foods for your baby’s development.",
                "Get plenty of sleep to maintain your energy levels."
            ]
        },
        {
            week: 17,
            fruit: "Pear",
            details: "Your baby is now the size of a pear, and it is starting to develop more muscle tone.",
            structure: "Height: 7.0 cms & Weight: 25 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66220ad623646baac7098771/avocado.png",
            symptoms: [
                {
                    title: "Round Ligament Pain",
                    description: "As your uterus grows, you may experience sharp pains on either side of your abdomen."
                },
                {
                    title: "Stretch Marks",
                    description: "Your skin may start to stretch, leading to stretch marks around your belly, breasts, and hips."
                },
                {
                    title: "Increased Discharge",
                    description: "You may notice more vaginal discharge as your body prepares for childbirth."
                }
            ],
            tips: [
                "Apply stretch mark creams to moisturize your skin.",
                "Wear a support belt to relieve round ligament pain.",
                "Wear cotton underwear to manage increased discharge."
            ]
        },
        {
            week: 18,
            fruit: "Sweet Potato",
            details: "Your baby is now the size of a sweet potato, and it is starting to develop its sense of hearing.",
            structure: "Height: 8.0 cms & Weight: 30 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66220cff34baeb5592c33a13/sweet-potato.png",
            symptoms: [
                {
                    title: "Skin Changes",
                    description: "Your skin may be more sensitive, and you may develop a pregnancy glow."
                },
                {
                    title: "Leg Cramps",
                    description: "Hormonal changes and extra weight can cause leg cramps, especially at night."
                },
                {
                    title: "Heartburn",
                    description: "You may experience more heartburn as your growing uterus puts pressure on your stomach."
                }
            ],
            tips: [
                "Stretch your legs before bed to prevent cramps.",
                "Eat smaller, more frequent meals to reduce heartburn.",
                "Stay hydrated to keep your skin healthy."
            ]
        },
        {
            week: 19,
            fruit: "Mango",
            details: "Your baby is now the size of a mango, and its movements are becoming more noticeable.",
            structure: "Height: 9.0 cms & Weight: 40 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66220dc27764da138df062d5/mango.png",
            symptoms: [
                {
                    title: "Increased Appetite",
                    description: "You may find yourself eating more as your baby grows."
                },
                {
                    title: "Back Pain",
                    description: "You may start to experience more back pain due to the growing weight of your baby."
                },
                {
                    title: "Frequent Urination",
                    description: "The pressure on your bladder may cause you to urinate more frequently."
                }
            ],
            tips: [
                "Eat smaller meals to manage hunger and avoid heartburn.",
                "Use a pregnancy pillow to relieve back pain.",
                "Practice pelvic floor exercises to strengthen muscles for childbirth."
            ]
        },
        {
            week: 20,
            fruit: "Bell Pepper",
            details: "Your baby is now the size of a bell pepper, and it’s developing more distinct facial features.",
            structure: "Height: 10.0 cms & Weight: 50 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6623577b825eb0ceff4082bd/untitled-design-1-2.png",
            symptoms: [
                {
                    title: "Feeling Baby Move",
                    description: "You might begin to feel your baby moving, a sensation known as 'quickening.'"
                },
                {
                    title: "Skin Changes",
                    description: "Your skin may darken around your nipples and other areas."
                },
                {
                    title: "Round Ligament Pain",
                    description: "You may experience sharp pain as your uterus expands."
                }
            ],
            tips: [
                "Continue to stay active to keep your body strong.",
                "Stay hydrated to help with skin elasticity.",
                "Wear comfortable clothing to ease round ligament pain."
            ]
        },
        {
            week: 21,
            fruit: "Banana",
            details: "Your baby is now the size of a banana, and its muscles are becoming stronger.",
            structure: "Height: 10.5 cms & Weight: 80 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/662210ace038dd559ba6fd66/banana.png",
            symptoms: [
                {
                    title: "Swelling",
                    description: "You may notice some swelling in your feet and ankles due to increased blood volume."
                },
                {
                    title: "Increased Discharge",
                    description: "Vaginal discharge may increase as your body prepares for labor."
                },
                {
                    title: "Back Pain",
                    description: "Your growing belly might be putting more strain on your back, causing discomfort."
                }
            ],
            tips: [
                "Elevate your feet to reduce swelling.",
                "Wear comfortable shoes to support your back.",
                "Stay active and do gentle stretching to ease back pain."
            ]
        },
        {
            week: 22,
            fruit: "Papaya",
            details: "Your baby is now the size of a papaya, and its skin is starting to become less translucent.",
            structure: "Height: 11.0 cms & Weight: 100 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/662769e8260cce82b751d5b7/green-papaya.png",
            symptoms: [
                {
                    title: "Breast Changes",
                    description: "Your breasts are continuing to grow and may become more sensitive."
                },
                {
                    title: "Nausea",
                    description: "Some women experience nausea again due to hormonal changes."
                },
                {
                    title: "Stretch Marks",
                    description: "You may notice stretch marks on your belly, hips, or breasts as your skin stretches."
                }
            ],
            tips: [
                "Apply moisturizing lotion to prevent stretch marks.",
                "Take it easy if nausea returns and rest when needed.",
                "Wear a supportive bra to alleviate breast discomfort."
            ]
        },
        {
            week: 23,
            fruit: "Eggplant",
            details: "Your baby is now the size of a eggplant, and it is beginning to develop fat under its skin.",
            structure: "Height: 12.0 cms & Weight: 200 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/662212c77764da138df113b7/eggplant.png",
            symptoms: [
                {
                    title: "Frequent Urination",
                    description: "The pressure from your growing baby on your bladder might cause frequent urination."
                },
                {
                    title: "Heartburn",
                    description: "As your uterus expands, it may put pressure on your stomach, leading to heartburn."
                },
                {
                    title: "Breast Tenderness",
                    description: "Your breasts may still be tender and sore as they prepare for breastfeeding."
                }
            ],
            tips: [
                "Eat smaller meals to avoid heartburn.",
                "Use a pregnancy pillow to support your growing belly.",
                "Stay hydrated and keep your skin moisturized."
            ]
        },
        {
            week: 24,
            fruit: "Ear of Corn",
            details: "Your baby is now the size of a ear of corn, and its lungs are starting to develop.",
            structure: "Height: 13.0 cms & Weight: 250 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66221642ab5624aac08361ac/ear-of-corn.png",
            symptoms: [
                {
                    title: "Leg Cramps",
                    description: "You may experience leg cramps due to the extra weight and hormonal changes."
                },
                {
                    title: "Increased Appetite",
                    description: "You may feel hungrier as your baby grows and needs more nutrients."
                },
                {
                    title: "Back Pain",
                    description: "The extra weight in your belly may be causing more back pain."
                }
            ],
            tips: [
                "Stretch your legs before bed to prevent cramps.",
                "Eat nutrient-dense foods to keep both you and your baby healthy.",
                "Wear supportive shoes to relieve back pain."
            ]
        },
        {
            week: 25,
            fruit: "Acorn Squash",
            details: "Your baby is now the size of a acorn squash, and its eyes are beginning to open.",
            structure: "Height: 14.0 cms & Weight: 300 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66235016f89107cf64211576/acorn-squash.png",
            symptoms: [
                {
                    title: "Back Pain",
                    description: "The extra weight and growing uterus may cause significant back pain."
                },
                {
                    title: "Swelling",
                    description: "You might experience swelling in your feet, ankles, and hands."
                },
                {
                    title: "Frequent Urination",
                    description: "The pressure on your bladder may cause you to urinate more frequently."
                }
            ],
            tips: [
                "Wear comfortable, supportive shoes to reduce swelling.",
                "Practice good posture to alleviate back pain.",
                "Stay hydrated to manage swelling."
            ]
        },
        {
            week: 26,
            fruit: "Zucchini",
            details: "Your baby is now the size of a head of zucchini, and its lungs are developing more.",
            structure: "Height: 14.5 cms & Weight: 350 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6622193546a47c7e4276f898/zucchini.png",
            symptoms: [
                {
                    title: "Shortness of Breath",
                    description: "As your uterus grows, it may put pressure on your diaphragm, causing shortness of breath."
                },
                {
                    title: "Back Pain",
                    description: "The growing weight of your baby can cause more back pain."
                },
                {
                    title: "Frequent Urination",
                    description: "The pressure on your bladder will continue to cause frequent trips to the bathroom."
                }
            ],
            tips: [
                "Practice deep breathing exercises to relieve shortness of breath.",
                "Use a pregnancy pillow to support your back.",
                "Wear loose clothing to alleviate pressure on your bladder."
            ]
        },
        {
            week: 27,
            fruit: "Cauliflower",
            details: "Your baby is now the size of an cauliflower, and its brain is developing rapidly.",
            structure: "Height: 15.0 cms & Weight: 400 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66221a5346a47c7e42772c2c/cauliflower.png",
            symptoms: [
                {
                    title: "Heartburn",
                    description: "You may experience more heartburn as your baby grows and puts pressure on your stomach."
                },
                {
                    title: "Swelling",
                    description: "Swelling in your feet, ankles, and hands may become more pronounced."
                },
                {
                    title: "Back Pain",
                    description: "Your growing belly may cause more strain on your back."
                }
            ],
            tips: [
                "Avoid spicy and fatty foods to reduce heartburn.",
                "Elevate your feet to reduce swelling.",
                "Use a pregnancy pillow to support your back."
            ]
        },
        {
            week: 28,
            fruit: "Head of Lettuce",
            details: "Your baby is now the size of a head of lettuce, and its eyes are fully formed.",
            structure: "Height: 16.0 cms & Weight: 500 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66221aef22320b16a42cc0f7/head-of-lettuce.png",
            symptoms: [
                {
                    title: "Frequent Urination",
                    description: "You may find yourself needing to use the bathroom more often due to the growing baby."
                },
                {
                    title: "Stretch Marks",
                    description: "Stretch marks may become more visible as your belly expands."
                },
                {
                    title: "Heartburn",
                    description: "The growing baby may cause more pressure on your stomach, leading to heartburn."
                }
            ],
            tips: [
                "Use stretch mark creams to keep your skin moisturized.",
                "Practice good posture to reduce back pain.",
                "Avoid large meals to prevent heartburn."
            ]
        },
        {
            week: 29,
            fruit: "Small Pumpkin",
            details: "Your baby is now the size of a small pumpkin, and its bones are becoming stronger.",
            structure: "Height: 17.0 cms & Weight: 600 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6622239950a6798a3b2980a8/pumpkin.png",
            symptoms: [
                {
                    title: "Frequent Urination",
                    description: "You may find yourself needing to use the bathroom more often due to the growing baby."
                },
                {
                    title: "Back Pain",
                    description: "The weight of your baby is causing more strain on your back."
                },
                {
                    title: "Stretch Marks",
                    description: "Stretch marks may become more visible as your belly expands."
                }
            ],
            tips: [
                "Use a pregnancy pillow to support your back and belly.",
                "Stay hydrated to reduce swelling.",
                "Practice pelvic tilts to alleviate back pain."
            ]
        },
        {
            week: 30,
            fruit: "Cabbage",
            details: "Your baby is now the size of a cabbage, and its lungs are continuing to develop.",
            structure: "Height: 18.0 cms & Weight: 700 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6622243e22320b16a42e4d6f/cabbage.png",
            symptoms: [
                {
                    title: "Frequent Urination",
                    description: "The pressure on your bladder continues to cause frequent trips to the bathroom."
                },
                {
                    title: "Fatigue",
                    description: "You may feel more tired as your body works harder to support your baby."
                },
                {
                    title: "Heartburn",
                    description: "Heartburn may become more frequent as your baby grows."
                }
            ],
            tips: [
                "Eat smaller meals to avoid heartburn.",
                "Use pillows to support your back and belly while sleeping.",
                "Take breaks and rest when needed to manage fatigue."
            ]
        },
        {
            week: 31,
            fruit: "Coconut",
            details: "Your baby is now the size of a coconut, and its eyes are beginning to open.",
            structure: "Height: 19.0 cms & Weight: 800 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66276a1c5938f98218c62c04/green-coconut.png",
            symptoms: [
                {
                    title: "Swelling",
                    description: "You may experience more swelling in your feet, ankles, and hands."
                },
                {
                    title: "Back Pain",
                    description: "Your growing belly may be putting more strain on your back."
                },
                {
                    title: "Frequent Urination",
                    description: "The pressure from your baby may cause you to urinate more frequently."
                }
            ],
            tips: [
                "Elevate your feet to reduce swelling.",
                "Wear supportive shoes to help with back pain.",
                "Stay active and practice gentle stretching to ease discomfort."
            ]
        },
        {
            week: 32,
            fruit: "Napa Cabbage",
            details: "Your baby is now the size of a napa cabbage, and its bones are continuing to harden.",
            structure: "Height: 20.0 cms & Weight: 900 gms",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66224afbc24056eda3ca058d/napa-cabbage.png",
            symptoms: [
                {
                    title: "Breast Changes",
                    description: "Your breasts may continue to grow and become more tender as your body prepares for breastfeeding."
                },
                {
                    title: "Back Pain",
                    description: "The added weight of your baby may cause more strain on your back."
                },
                {
                    title: "Frequent Urination",
                    description: "As your baby grows, you may need to urinate more frequently."
                }
            ],
            tips: [
                "Wear a supportive bra to alleviate breast discomfort.",
                "Practice good posture to relieve back pain.",
                "Take breaks to reduce pressure on your bladder."
            ]
        },
        {
            week: 33,
            fruit: "Pineapple",
            details: "Your baby is now the size of a pineapple, and its brain and nervous system are maturing.",
            structure: "Height: 21.0 cms & Weight: 1 kg",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66224b9d6328f0a57ddd4725/pineapple.png",
            symptoms: [
                {
                    title: "Leg Cramps",
                    description: "You may experience more leg cramps as your pregnancy progresses."
                },
                {
                    title: "Swelling",
                    description: "Swelling in your feet, ankles, and hands may continue."
                },
                {
                    title: "Back Pain",
                    description: "The extra weight and growing uterus may be causing more back pain."
                }
            ],
            tips: [
                "Stretch your legs before bed to reduce cramps.",
                "Elevate your feet to reduce swelling.",
                "Use a pregnancy pillow for added support while sleeping."
            ]
        },
        {
            week: 34,
            fruit: "Cantaloupe Melon",
            details: "Your baby is now the size of a cantaloupe melon, and its lungs are developing more.",
            structure: "Height: 22.0 cms & Weight: 1.1 kg",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66224cd7be07105aa50dfcea/cantaloupe.png",
            symptoms: [
                {
                    title: "Heartburn",
                    description: "You may experience more heartburn as your baby grows and puts pressure on your stomach."
                },
                {
                    title: "Back Pain",
                    description: "Your growing belly may be putting more strain on your back."
                },
                {
                    title: "Swelling",
                    description: "Swelling in your feet, ankles, and hands may continue to increase."
                }
            ],
            tips: [
                "Eat smaller meals to avoid heartburn.",
                "Wear supportive shoes to help with back pain.",
                "Stay active and practice gentle stretching."
            ]
        },
        {
            week: 35,
            fruit: "Honeydew Melon",
            details: "Your baby is now the size of a honeydew melon, and its skin is becoming less transparent.",
            structure: "Height: 23.0 cms & Weight: 1.2 kg",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/662353d7825eb0ceff3ffe9f/honeydrew-melon.png",
            symptoms: [
                {
                    title: "Frequent Urination",
                    description: "The pressure from your growing baby may cause frequent trips to the bathroom."
                },
                {
                    title: "Shortness of Breath",
                    description: "As your baby grows, it may push against your diaphragm, causing shortness of breath."
                },
                {
                    title: "Back Pain",
                    description: "The weight of your baby may cause increased back pain."
                }
            ],
            tips: [
                "Practice deep breathing to relieve shortness of breath.",
                "Use a pregnancy pillow to support your back while sleeping.",
                "Elevate your feet to reduce swelling."
            ]
        },
        {
            week: 36,
            fruit: "Romaine Lettuce",
            details: "Your baby is now the size of a romaine lettuce, and its lungs are fully developed.",
            structure: "Height: 24.0 cms & Weight: 1.4 kg",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66224e562e414685f596fe16/head-of-romaine-lettuce.png",
            symptoms: [
                {
                    title: "Braxton Hicks Contractions",
                    description: "You may start feeling practice contractions as your body prepares for labor."
                },
                {
                    title: "Swelling",
                    description: "Swelling in your feet, ankles, and hands may become more noticeable."
                },
                {
                    title: "Back Pain",
                    description: "The extra weight from your growing baby may continue to cause back pain."
                }
            ],
            tips: [
                "Drink plenty of water to stay hydrated and reduce swelling.",
                "Rest as much as possible to prepare for labor.",
                "Use a pregnancy pillow to support your back and belly."
            ]
        },
        {
            week: 37,
            fruit: "Swiss Chard",
            details: "Your baby is now the size of a swiss chard, and its organs are maturing.",
            structure: "Height: 25.0 cms & Weight: 1.6 kg",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/66224f40609c12858f52ace6/swiss-chard.png",
            symptoms: [
                {
                    title: "Frequent Urination",
                    description: "As your baby moves lower into your pelvis, you may feel the need to urinate more often."
                },
                {
                    title: "Shortness of Breath",
                    description: "The growing baby may put pressure on your diaphragm, making it harder to breathe."
                },
                {
                    title: "Back Pain",
                    description: "Your growing belly continues to cause back pain."
                }
            ],
            tips: [
                "Rest and take breaks to reduce shortness of breath.",
                "Use a heating pad to ease back pain.",
                "Stay hydrated to reduce swelling."
            ]
        },
        {
            week: 38,
            fruit: "Rhubarb",
            details: "Your baby is now the size of a rhubarb, and its brain is continuing to develop.",
            structure: "Height: 26.0 cms & Weight: 1.8 kg",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6622509796836854b7c5741a/rhubarb.png",
            symptoms: [
                {
                    title: "Fatigue",
                    description: "You may feel more tired as your body prepares for labor."
                },
                {
                    title: "Swelling",
                    description: "Swelling in your feet, ankles, and hands may become more noticeable."
                },
                {
                    title: "Back Pain",
                    description: "The growing weight of your baby continues to strain your back."
                }
            ],
            tips: [
                "Take naps and rest when needed.",
                "Practice deep breathing exercises to reduce stress.",
                "Use a pregnancy pillow to support your back and belly."
            ]
        },
        {
            week: 39,
            fruit: "Small Watermelon",
            details: "Your baby is now the size of a small watermelon, and it is ready for birth.",
            structure: "Height: 27.0 cms & Weight: 2 kg",
            image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/662251432a0944553c4353e2/watermelon.png",
            symptoms: [
                {
                    title: "Frequent Urination",
                    description: "You may find yourself needing to urinate more often as your baby drops lower."
                },
                {
                title: "Braxton Hicks Contractions",
                description: "Practice contractions may become more frequent and intense."
            },
            {
                title: "Back Pain",
                description: "The weight of your baby may continue to cause back pain."
            },
            {
                title: "Pelvic Pressure",
                description: "You may feel increased pressure in your pelvic area as your baby moves lower."
            },
         ],
        tips: [
            "Pack your hospital bag if you haven’t already.",
            "Stay hydrated and eat small, nutritious meals.",
            "Practice breathing techniques to prepare for labor.",
            "Keep your phone charged and ready to call your healthcare provider."
        ]
    },

    {
        week: 40,
        fruit: "Pumpkin",
        details: "Your baby is now the size of a pumpkin and is fully developed, ready for birth.",
        structure: "Height: 28.0 cms & Weight: 3.2 kg",
        image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6622516204af645aac13305e/pumpkin.png",
        symptoms: [
            {
                title: "Loss of Mucus Plug",
                description: "You may notice the loss of the mucus plug, which is a sign that labor is near."
            },
            {
                title: "Increased Braxton Hicks Contractions",
                description: "These practice contractions may feel stronger and more frequent."
            },
            {
                title: "Restlessness",
                description: "You might feel restless and have difficulty sleeping due to anticipation."
            },
            {
                title: "Pelvic Pain",
                description: "The pressure of your baby moving lower can cause discomfort in your pelvic region."
            }
        ],
        tips: [
            "Stay calm and keep your support system informed.",
            "Focus on relaxation techniques to prepare for labor.",
            "Monitor contractions and time them if they become regular.",
            "Contact your healthcare provider if you notice any unusual symptoms."
        ]
    },
    {
        week: 41,
        fruit: "Pumpkin",
        details: "Your baby is now the size of a pumpkin, and you may be nearing a planned induction or natural labor.",
        structure: "Height: 29.0 cms & Weight: 3.5 kg",
        image:"https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6622516204af645aac13305e/pumpkin.png",
        symptoms: [
            {
                title: "Overdue Pregnancy Symptoms",
                description: "You may feel more tired and uncomfortable as your pregnancy extends beyond the due date."
            },
            {
                title: "Increased Vaginal Discharge",
                description: "You might notice an increase in vaginal discharge as labor approaches."
            },
            {
                title: "Swelling",
                description: "Swelling in your hands, feet, and ankles may continue or worsen."
            },
            {
                title: "Anxiety",
                description: "You may feel anxious or impatient as you wait for labor to begin."
            }
        ],
        tips: [
            "Stay in touch with your healthcare provider for regular check-ups.",
            "Keep track of your baby's movements and notify your doctor if you notice any changes.",
            "Engage in light physical activity, such as walking, to help encourage labor.",
            "Prepare mentally and emotionally for the birthing process."
        ]
    },
        ];
    
    const handleWeekClick = (week) => {
        setSelectedWeek(week);
        const element = document.querySelector(`[data-week="${week}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handlePrevClick = () => {
        sliderRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    };

    const handleNextClick = () => {
        sliderRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    };

    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            const handleWheel = (e) => {
                e.preventDefault();
                slider.scrollLeft += e.deltaY;
            };

            slider.addEventListener('wheel', handleWheel, { passive: false });
            return () => slider.removeEventListener('wheel', handleWheel);
        }
    }, []);

    const selectedData = weekData.find(data => data.week === selectedWeek);

    return (
        <div className="tracker-container">
            <div className="essential-container">
                <div className="essential-banner">
                    <h1>Hey Mommy-To-Be!! Want to know how your baby is growing?</h1>
                    <img src="images\pregnant.png" alt="Health tracker illustration" className="banner-image" />
                </div>
            </div>
    
            <div className="week-slider-wrapper">
                <button className="prev" onClick={handlePrevClick}>&#10094;</button>
                <div
                    className="week-slider"
                    ref={sliderRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {weekData.map(data => (
                        <button
                            key={data.week}
                            data-week={data.week}
                            className={`week-button ${data.week === selectedWeek ? 'active' : ''}`}
                            onClick={() => handleWeekClick(data.week)}
                        >
                            Week {data.week}
                        </button>
                    ))}
                </div>
                <button className="next" onClick={handleNextClick}>&#10095;</button>
            </div>
    
            {selectedData && (
                <>
                    <div className="content">
                        <h2>Congratulations!!</h2>
                        <p>Your Baby Size Is {selectedData.fruit} Now!</p>
                        <img
                            src={selectedData.image}
                            alt={selectedData.fruit}
                            className="fruit-image"
                        />
                    </div>
    
                    <div className="details">
                        <h3>Baby's Structure</h3>
                        <p>{selectedData.details}<br />{selectedData.structure}</p>
                        <h3>Common Symptoms</h3>
                        {selectedData.symptoms && selectedData.symptoms.length > 0 ? (
                            selectedData.symptoms.map((symptom, index) => (
                                <div key={index}>
                                    <h5 className='side-heading'>{symptom.title}</h5>
                                    <p>{symptom.description}</p>
                                </div>
                            ))
                        ) : (
                            <p>No symptoms available.</p>
                        )}
                        
                        <h3>Tips</h3>
                        {selectedData.tips && selectedData.tips.length > 0 ? (
                            <ul>
                                {selectedData.tips.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No tips available.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
    
};

export default BabyDevelopmentTracker;