import Dashboard from '@mui/icons-material/Dashboard'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import Category from '@mui/icons-material/Category'
import BusinessIcon from '@mui/icons-material/Business';
import capitalizeEachWord from '@/utils/capitalizeEachWord';
import sanitizeString from '@/utils/sanitizeString';
import event from '../../../utils/events/customHashChangeEvent';
import InventoryIcon from '@mui/icons-material/Inventory';
import EmergencyRecordingIcon from '@mui/icons-material/EmergencyRecording';
import link from '@/app/admin/link';

function transformArray(array) {
    const result = new Map()

    array.sort((a, b) => a.group - b.group).forEach(item => {

        if (!result.has(item.group)) {
            result.set(item.group, [])
        }
        result.get(item.group).push({
            ...item,
            name: item.name.toLowerCase(),
            link: item.link || item.base,
        })
    })

    Array.from(result.values()).forEach(group => {
        group.sort((a, b) => {
            if (a.order === undefined) return 1
            if (b.order === undefined) return -1
            return a.order - b.order
        })
    })

    return Array.from(result.values())
}

const navOptions = [
    {
        group: 1,
        displayname: {
            tab: "Product list",
            title: "Manage Products"
        },
        name: "Product",
        icon: <Category />,
        link: `${link.product}#0`,
        base: link.product,
        ascontent: true,
        content: [
            {
                name: "Product Type",
                displayname: {
                    nav: "Type",
                },
                link: `${link.product}#1`,
            },
            {
                name: "Product Origin",
                displayname: {
                    nav: "Origin",
                },
                link: `${link.product}#1`,
            },
        ]
    },
    {
        group: 1,
        displayname: {
            tab: "Business",
            nav: "Business",
            title: "Manage Business"
        },
        name: "Business",
        icon: <BusinessIcon />,
        link: link.business,
        base: link.business,
        ascontent: true,
        content: [
            {
                name: "Customer",
                link: `${link.business}#0`,
            },
            {
                name: "Invoice",
                link: `${link.business}#1`,
            },
        ]
    },
    {
        group: 1,
        displayname: {
            tab: "Inventory",
            title: "Manage Inventory"
        },
        name: "Inventory",
        icon: <InventoryIcon />,
        link: link.inventory,
        base: link.inventory,
    },
    {
        order: 0,
        group: 0,
        name: "Dashboard",
        link: link.base,
        icon: <Dashboard />
    },
    {
        group: 2,
        displayname: {
            title: "Demonstrate Form Component",
        },
        name: "Demo",
        link: link.demo,
        icon: <EmergencyRecordingIcon />,
    },
]
export default navOptions

const configurateOption = (option, tabs) => {
    const updatedOption = { ...option };
    let pendingObject

    updatedOption.displayname = {
        nav: capitalizeEachWord(updatedOption.displayname?.nav || updatedOption.name),
        title: capitalizeEachWord(updatedOption.displayname?.title || updatedOption.name),
        tab: capitalizeEachWord(updatedOption.displayname?.tab || updatedOption.name)
    }
    updatedOption.name = sanitizeString(updatedOption.name);

    if (updatedOption.content) {
        tabs[updatedOption.name] = updatedOption.content.map(item => ({
            name: sanitizeString(item.name),
            displayname: capitalizeEachWord(item.displayname?.tab || item.name),
        }))
    }
    if (updatedOption.link) {
        var str = updatedOption.link.split("#")
        updatedOption.link = str[0]
        if (updatedOption.content && updatedOption.ascontent) {
            updatedOption.hash = ''
            pendingObject = true
        } else {
            updatedOption.hash = tabs[str[1]]?.name || ''
        }
        //console.log(updatedOption.link, updatedOption.hash, updatedOption.base)

        updatedOption.validator = (window) => {
            /*
            //console.log('validator pathname', updatedOption.name, updatedOption)
            //console.log('validator pathname', window.location.pathname, updatedOption.link)
            //console.log('validator hash', window.location.hash, updatedOption.hash)
            */
            let res = window.location.pathname === updatedOption.base
                || (window.location.hash.substring(1) === updatedOption.hash
                    && window.location.pathname === updatedOption.link)
            //console.log('validator res', res)
            return res
        }
        updatedOption.func = updatedOption.hash || pendingObject ? (window, router) => {
            router.push(updatedOption.link + '#' + updatedOption.hash);
            window.dispatchEvent(event({ path: updatedOption.link, hash: updatedOption.hash }))
        } : (window, router) => {
            console.log('pushing to', updatedOption.link)
            router.push(updatedOption.link)
        };
    }
    if (updatedOption.content) {
        updatedOption.content = updatedOption.content.map((e) =>
            configurateOption(e, tabs[updatedOption.name])
        )
        if (pendingObject)
            tabs[updatedOption.name].unshift({
                name: updatedOption.name,
                displayname: updatedOption.displayname.tab
            })
    }
    return updatedOption;
}

const configurateOptions = (options) => {
    const tabs = {}
    return [options.map(option => {
        return configurateOption(option, tabs);
    }), tabs]

}

const [UpdatedNavOptions, NavTabs] = configurateOptions(navOptions)
//console.log('updatedNavOptions', UpdatedNavOptions)
//console.log("NavTabsNavTabsNavTabsNavTabs", NavTabs)

const SearchNavOptions = UpdatedNavOptions.map(option => ({
    ...option,
    content: option.content?.filter(item => item.hideInNav !== true)
}))
const SimplifiedNavOptions = transformArray(UpdatedNavOptions)
export { SimplifiedNavOptions, SearchNavOptions, NavTabs }
