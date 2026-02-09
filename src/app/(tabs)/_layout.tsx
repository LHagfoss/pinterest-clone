import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
    return (
        <NativeTabs tintColor="#7f00e6">
            <NativeTabs.Trigger
                name="feed"
                contentStyle={{
                    backgroundColor: "#000000",
                }}
            >
                <NativeTabs.Trigger.Label>Feed</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    selectedColor="#7f00e6"
                    sf="house.fill"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="search">
                <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    selectedColor="#7f00e6"
                    sf="magnifyingglass"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="create">
                <NativeTabs.Trigger.Label>Create</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon selectedColor="#7f00e6" sf="plus" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="profile">
                <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    selectedColor="#7f00e6"
                    sf="person.fill"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="settings">
                <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon selectedColor="#7f00e6" sf="gear" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
