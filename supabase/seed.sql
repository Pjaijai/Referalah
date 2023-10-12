-- Insert data into the "city" table
-- Insert data into the "country" table
INSERT INTO country (id, uuid, value, english_name, cantonese_name)
VALUES
  (1, 'c55a2a85-bd17-423d-b49f-548dc859ab67', 'canada', 'Canada', '加拿大');

-- Insert data into the "province" table
INSERT INTO province (id, uuid, value, country_uuid, english_name, cantonese_name)
VALUES
  (1, '090d3e23-d1bb-4fff-b6c0-87fc4da6304c', 'alberta', 'c55a2a85-bd17-423d-b49f-548dc859ab67', 'Alberta', '亞伯達省'),
  (3, '7546ebd4-6057-4d63-b1ae-40a8ee520c33', 'ontario', 'c55a2a85-bd17-423d-b49f-548dc859ab67', 'Ontario', '安大略省'),
  (4, '65732979-af98-4a8a-aeac-203d506bcdaa', 'quebec', 'c55a2a85-bd17-423d-b49f-548dc859ab67', 'Quebec', '魁北克'),
  (2, '62f381bd-c061-4c89-a9eb-7a902a69dfe9', 'british_columbia', 'c55a2a85-bd17-423d-b49f-548dc859ab67', 'British Columbia', '不列顛哥倫比亞省'),
  (5, '42a12df3-f785-44e7-9aca-208602b1544c', 'nova_scotia', 'c55a2a85-bd17-423d-b49f-548dc859ab67', 'Nova Scotia', '新斯科細亞'),
  (6, '2a44e69f-3ae1-45ea-8dd3-572663b9e303', 'new_brunswick', 'c55a2a85-bd17-423d-b49f-548dc859ab67', 'New Brunswick', '新不倫瑞克省'),
  (7, '9670157c-7370-4caa-86c6-4e73d0218796', 'manitoba', 'c55a2a85-bd17-423d-b49f-548dc859ab67', 'Manitoba', '馬尼托巴'),
  (8, '0f66dd8f-22d2-4977-9f5e-54149750d330', 'prince_edward_island', 'c55a2a85-bd17-423d-b49f-548dc859ab67', 'Prince Edward Island', '愛德華王子島'),
  (9, '0d38e506-4421-4283-bcb5-28e0bf0caf03', 'saskatchewan', 'c55a2a85-bd17-423d-b49f-548dc859ab67', 'Saskatchewan', '沙斯卡寸旺省'),
  (10, '1cd459f0-0e0f-45fe-9c4b-ec7e0ce22340', 'newfoundland_and_labrador', 'c55a2a85-bd17-423d-b49f-548dc859ab67', 'Newfoundland and Labrador', '紐芬蘭及拉布拉多');

INSERT INTO city (id, uuid, value, province_uuid, english_name, cantonese_name)
VALUES
  (1, '69a46dce-b0a1-4ba7-94f1-f6486ed48ca4', 'calgary', '090d3e23-d1bb-4fff-b6c0-87fc4da6304c', 'Calgary', '卡加里'),
  (5, '603de184-7a1f-4fd3-b094-e3e357b85f1c', 'ottawa', '7546ebd4-6057-4d63-b1ae-40a8ee520c33', 'Ottawa', '渥太華'),
  (6, '300fe61e-d77a-434c-bdb7-b462a8c5ebcd', 'london', '7546ebd4-6057-4d63-b1ae-40a8ee520c33', 'London', '倫敦'),
  (7, 'bf0c965c-6380-46fc-8fb0-13515742cb28', 'quebec_city', '65732979-af98-4a8a-aeac-203d506bcdaa', 'Quebec City', '魁北克市'),
  (8, 'f4d1ee38-4c00-4298-8af2-869ba8872430', 'montreal', '65732979-af98-4a8a-aeac-203d506bcdaa', 'Montreal', '滿地可'),
  (4, '9ca24784-9716-4f91-84dd-5641e7f261cf', 'toronto', '7546ebd4-6057-4d63-b1ae-40a8ee520c33', 'Toronto', '多倫多'),
  (3, 'c348552a-6096-4dab-b710-0cb92f90790b', 'vancouver', '62f381bd-c061-4c89-a9eb-7a902a69dfe9', 'Vancouver', '溫哥華'),
  (2, '2b18a77f-6c41-4379-af90-a6c47ee545f1', 'edmonton', '090d3e23-d1bb-4fff-b6c0-87fc4da6304c', 'Edmonton', '愛民頓'),
  (9, '82a8511d-7f92-4e7b-a90e-d48a0bc5a445', 'halifax', '42a12df3-f785-44e7-9aca-208602b1544c', 'Halifax', '哈利法克斯'),
  (10, '4de0e48e-fb8f-49ae-9966-85e12e60eeec', 'fredericton', '2a44e69f-3ae1-45ea-8dd3-572663b9e303', 'Fredericton', '弗雷德里克頓'),
  (11, '6f02d216-2c64-4fa0-a8d2-37c9c43c7ad8', 'moncton', '2a44e69f-3ae1-45ea-8dd3-572663b9e303', 'Moncton', '蒙克頓'),
  (12, 'b49f90a4-214c-4068-adb4-decc506dadbd', 'winnipeg', '9670157c-7370-4caa-86c6-4e73d0218796', 'Winnipeg', '溫尼伯'),
  (13, '3f5534ce-ad2a-4b52-a07d-5efc2c86ed88', 'victoria', '62f381bd-c061-4c89-a9eb-7a902a69dfe9', 'Victoria', '維多利亞'),
  (14, 'eddaced1-4336-473f-9268-82a0bd51957d', 'charlottetown', '0f66dd8f-22d2-4977-9f5e-54149750d330', 'Charlottetown', '夏洛特敦'),
  (15, 'db984e01-6d4a-4f1f-81ff-2589aed69044', 'regina', '0d38e506-4421-4283-bcb5-28e0bf0caf03', 'Regina', '雷吉納'),
  (16, '2e5d4fcf-fc67-47d8-b8fb-c9e671fae44c', 'saskatoon', '0d38e506-4421-4283-bcb5-28e0bf0caf03', 'Saskatoon', '沙斯加通'),
  (17, 'f8f68409-5789-44c3-8684-d7c6fa656623', 'st_Johns', '1cd459f0-0e0f-45fe-9c4b-ec7e0ce22340', 'St. Johns', '聖約翰'),
  (18, 'b2528cc2-21e2-4c5b-af1f-628aabcae9b1', 'waterloo', '7546ebd4-6057-4d63-b1ae-40a8ee520c33', 'Waterloo', '滑鐵盧');

-- Insert data into the "industry" table
INSERT INTO industry (id, uuid, value, english_name, cantonese_name)
VALUES
  (1, '7f7a3ceb-886d-480a-b35b-33721f7e2c75', 'creative_and_cultural', 'Culture', '文化產業'),
  (2, 'bb447b3d-10a8-48cc-849e-d578c3685241', 'information_and_technology', 'Information and Technology', '信息科技業'),
  (3, '4b2af2dd-e72c-4618-a928-fbde3c427599', 'education', 'Education', '教育業'),
  (4, 'a1a60af6-325b-4f7b-8543-f198e40404c1', 'banking_and_finance', 'Banking and Finance', '銀行及金融業'),
  (5, '0c9c8045-80ef-49fb-b931-3a8e3199602f', 'health_care', 'Health care', '醫療保健業'),
  (6, '10a553ee-e9e0-4a71-ae4a-21cab42bd340', 'utility', 'Utility', '公用事業'),
  (7, 'cfe1352a-b0a3-4b9c-b3e3-6f12a233beaa', 'game', 'Game', '遊戲業'),
  (8, '59869380-ca5c-4e3a-8138-0a80e2037561', 'textile', 'Textile', '紡織業'),
  (9, 'f8a30a93-6dee-49a3-a474-26a18f2d5ada', 'real_estate', 'Real estate', '房地產業'),
  (10, '4c8ec16f-80b7-43e1-af62-5b16abaf993d', 'public_service', 'Public Service', '公共服務業'),
  (11, 'ac2bb1eb-9e00-4e15-9b51-2972dc51947e', 'music', 'Music', '音樂業'),
  (12, 'a641f4f6-73a2-4c19-b666-69889867daed', 'food_and_beverage', 'Food & Beverage', '餐飲業'),
  (13, '429da610-49f3-4154-a235-3dce18e3e851', 'gambling', 'Gambling', '賭博業'),
  (14, 'dcf6fdcf-f124-45c6-9023-369ed01b9c1c', 'tourism_and_hospitality', 'Hospitality', '旅遊及款待業'),
  (15, '2e3a5bc6-84af-49e2-9d67-40c2220fe689', 'entertainment', 'Entertainment', '娛樂產業'),
  (16, '356ee0b6-34a4-402d-b01a-87bb5ad750e5', 'transport_and_logistics', 'Transport and Logistics', '運輸及物流業'),
  (17, '61b2af45-18cd-474c-9096-230510e02e04', 'construction', 'Construction', '建筑業'),
  (18, '52979570-24dc-408f-abfd-5b4b5aed9de1', 'advertising_and_marketing', 'Advertising and Marketing', '廣告及市場推廣業'),
  (19, '4bbe86ac-d8a7-4855-b585-64d25d331297', 'creative_industry', 'Creative Industry', '創意產業'),
  (20, '69f65821-9706-40ee-b7b7-cf837c30232f', 'design_industry', 'Design industry', '設計業'),
  (21, '489cd668-cdc2-4052-9a97-bf25576440e5', 'legal', 'Legal Industry', '法律行業'),
  (22, '82fc7fc4-e177-4330-99ce-1d34a238e52a', 'research_and_development', 'Research and Development', '學術研究'),
  (23, '37af5dc1-b1f8-4e58-a1d1-4726a5243e9d', 'human_resources', 'Human Resources', '人力資源'),
  (24, 'f468b272-4613-403f-a7e6-4f01c29043ec', 'automobile', 'Automobile', '汽車業');

