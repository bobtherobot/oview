
var bob1;
var bob2;
document.addEventListener("DOMContentLoaded", () => {

    bob1 = new oview.Main({
        elem : "target1"
            //fontSize : 10,
            //lineHeight : 10,
            //font : "Helvetica",
           //display : "dark" // light
    });

    bob2 = new oview.Main({
        elem : "target2"
            //fontSize : 10,
            //lineHeight : 10,
            //font : "Helvetica",
           //display : "dark" // light
    });

    var obj1 = {
        bob : "er",
        sally : {
            prop1 : 1,
            prop2 : 2,
            prop3 : 3
        }
    }

    var obj2 = {
        bob : "er",
        sally : {
            prop1 : 1,
            prop2 : 2,
            prop3 : 3
        }
    }

    var obj3 = `{
        "bob" : "json good",
        "sally" : {
            "prop1" : 1,
            "prop2" : 2,
            "prop3" : 3
        }
    }`;

    var obj4 = `{
        bob : "json js obj",
        sally : {
            prop1 : 1,
            prop2 : 2,
            prop3 : 3
        }
    }`;

    var obj5 = {
        "search": {},
        "utils": {
            "glassboxSessionId": "1d86b1d5-8e78-4a6e-8520-7ebd5dea1825:0",
            "aaBuildVersion": "Launch|production|2023-07-27T13:55:31Z;vztag:2023-07-25 @ 18:50:57|BODY|VCG Wireless Web (Cobra)",
            "visitNumber": "2",
            "lastVisit": "18 hours",
            "prevPageName": "gridwall_smartphones",
            "timePartingDay": "year=2023 | month=July | date=29 | day=Saturday | time=4:32 PM",
            "timePartingHour": "19",
            "timeZone": "GMT-0400 (Eastern Daylight Time)",
            "visitStart": "year=2023 | month=July | date=29 | day=Saturday | time=4:25 PM",
            "newRepeatVisitor": "repeat",
            "contentSquareMatchingKey": "0.11219813109568055_1690673132640"
        },
        "cmp": {},
        "page": {
            "throttle": "NSA Version|pdp 3.0",
            "cradleFlowJourney": "|SH_NAT_TRD_P|COMMON_PDP_SP_P|AI_W_P|VideoChatEnabled_PDP_NSE|vltmap_gw_nse|typeahead_here_gw_nse|Next_JS_Test_P|N_PLAN_P|FiosT|z1_s_t_g|PdpCfg_CL_P|C_LPNS|GW_LEFT_C_RAIL_P_D|CB_C_I_P|ABANDON_CART_GW|GW_C_INSIGHTS_P|AGT_C_AVL_P||",
            "bucketAllocator": "|SH_NAT_TRD_P|COMMON_PDP_SP_P|AI_W_P|VideoChatEnabled_PDP_NSE|vltmap_gw_nse|typeahead_here_gw_nse|Next_JS_Test_P|N_PLAN_P|FiosT|z1_s_t_g|PdpCfg_CL_P|C_LPNS|GW_LEFT_C_RAIL_P_D|CB_C_I_P|ABANDON_CART_GW|GW_C_INSIGHTS_P|AGT_C_AVL_P||",
            "sourceChannel": "vzw",
            "displayChannel": "vzw",
            "channel": "Shop",
            "name": "pdp_Smartphones_Galaxy Z Fold5",
            "throttleList": "|SH_NAT_TRD_P|COMMON_PDP_SP_P|AI_W_P|VideoChatEnabled_PDP_NSE|vltmap_gw_nse|typeahead_here_gw_nse|Next_JS_Test_P|N_PLAN_P|FiosT|z1_s_t_g|PdpCfg_CL_P|C_LPNS|GW_LEFT_C_RAIL_P_D|CB_C_I_P|ABANDON_CART_GW|GW_C_INSIGHTS_P|AGT_C_AVL_P||",
            "flow": "nse",
            "contentFragments": "",
            "channelSession": "POE-D-eb4961c5-df8e-4a44-a3de-161436f20043",
            "language": "english",
            "subFlow": "",
            "url": "https://www.verizon.com/smartphones/samsung-galaxy-z-fold5/"
        },
        "txn": {
            "product": {
                "current": [
                    {
                        "@class": "onevz.soe.omnidl.client.Current",
                        "category": "Device",
                        "offer": "promo4355973",
                        "nonRecurringPrice": "1799.99",
                        "qty": "1",
                        "sku": "sku6003064",
                        "id": "SMF946ULBEV",
                        "name": "Galaxy Z Fold5"
                    }
                ]
            }
        },
        "error": {},
        "event": {
            "value": "prodView"
        },
        "env": {
            "businessUnit": "wireless",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "server": "www.verizon.com",
            "pathname": "/smartphones/samsung-galaxy-z-fold5/",
            "platform": "desktop"
        },
        "user": {
            "customerType": "",
            "accountType": "Unauthenticated",
            "authStatus": "anonymous",
            "account": "",
            "customerBusiness": "no_cust",
            "crmHashEmail": "",
            "crmHashAcct": "",
            "crmHashMdn": "",
            "session": "43dc74cezc718z438czbecaz9d40b66b9ac3",
            "language": "english"
        },
        "target": {
            "offer": "none",
            "engagement": {
                "offered": "3RD_PARTY_REDEMPTION-promo4355543|3RD_PARTY_REDEMPTION-promo4355393|SIMPLE-promo4355973|BICBMSM-promo4355811|BICBMSM-promo4355809|TRADEIN_PROMO-promo4355955|TRADEIN_PROMO-promo4355956|BUY X GET Y-promo4354100",
                "intent": "shop",
                "id": "none"
            },
            "sandbox": "|SH_NAT_TRD_P|COMMON_PDP_SP_P|AI_W_P|VideoChatEnabled_PDP_NSE|vltmap_gw_nse|typeahead_here_gw_nse|Next_JS_Test_P|N_PLAN_P|FiosT|z1_s_t_g|PdpCfg_CL_P|C_LPNS|GW_LEFT_C_RAIL_P_D|CB_C_I_P|ABANDON_CART_GW|GW_C_INSIGHTS_P|AGT_C_AVL_P||",
            "tt": {
                "category": "Device",
                "categoryId": "Smartphones",
                "color": "/Icy Blue/Phantom Black/Cream/",
                "skuid": "sku6003064",
                "thumbnailUrl": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-q5-icy-blue?$device-thumb$",
                "type": "PDA/Smartphones",
                "inventory": "0",
                "make": "Samsung",
                "model": "Samsung Galaxy Z Fold5 512 GB Icy Blue",
                "name": "Galaxy Z Fold5",
                "productId": "SMF946ULBEV",
                "price": "1799.99",
                "bvProductId": "dev21410439",
                "monthlyBadgeText": "Save $120.  ",
                "monthlyBadgeToolTipUrl": "/us/promotion/details?promoId=promo4355973&deviceId=dev21410439&skuId=sku6003064&flow=NSE&loanTerm=36,NFL-SundayTicket-Thirdparty",
                "retailBadgeText": "Save $120.  ",
                "retailBadgeToolTipUrl": "/us/promotion/details?promoId=promo4355973&deviceId=dev21410439&skuId=sku6003064&flow=NSE&loanTerm=0,NFL-SundayTicket-Thirdparty",
                "promoId": "promo4355973",
                "monthlyPrice36DPP": "53.33",
                "monthlyPromoPrice36DPP": "49.99",
                "legalText": "Monthly payments shown are for customers who qualify to pay $0 Down, $49.99/mo. for 36 months; 0% APR. Retail Price: $1919.99"
            },
            "cloud": "20334079470348767588621871497755386031",
            "tntAbandonCart": "false"
        },
        "park": {
            "category": "Device",
            "categoryId": "Smartphones",
            "color": "/Icy Blue/Phantom Black/Cream/",
            "skuid": "sku6003064",
            "thumbnailUrl": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-q5-icy-blue?$device-thumb$",
            "type": "PDA/Smartphones",
            "inventory": "0",
            "make": "Samsung",
            "model": "Samsung Galaxy Z Fold5 512 GB Icy Blue",
            "name": "Galaxy Z Fold5",
            "productId": "SMF946ULBEV",
            "price": "1799.99",
            "bvProductId": "dev21410439",
            "monthlyBadgeText": "Save $120.  ",
            "monthlyBadgeToolTipUrl": "/us/promotion/details?promoId=promo4355973&deviceId=dev21410439&skuId=sku6003064&flow=NSE&loanTerm=36,NFL-SundayTicket-Thirdparty",
            "retailBadgeText": "Save $120.  ",
            "retailBadgeToolTipUrl": "/us/promotion/details?promoId=promo4355973&deviceId=dev21410439&skuId=sku6003064&flow=NSE&loanTerm=0,NFL-SundayTicket-Thirdparty",
            "promoId": "promo4355973",
            "monthlyPrice36DPP": "53.33",
            "monthlyPromoPrice36DPP": "49.99",
            "legalText": "Monthly payments shown are for customers who qualify to pay $0 Down, $49.99/mo. for 36 months; 0% APR. Retail Price: $1919.99",
            "pageUrlParams": "",
            "journeyGroupID": 1,
            "segmentName": "https://www.verizon.com/smartphones/samsung-galaxy-z-fold5/",
            "pageName": "vzw|Shop|nse|pdp_Smartphones_Galaxy Z Fold5",
            "globalId": "43dc74cezc718z438czbecaz9d40b66b9ac3",
            "medallia_pre": ""
        }
    }

    bob1.add(obj1);
    bob1.add(obj2, "this is my header");
    bob1.add(obj3, "real json");
    bob1.add(obj4, "js js obj");


    bob2.add(obj5, "verizon vzdl");

});
